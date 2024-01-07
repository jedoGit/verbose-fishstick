const fs = require("fs");
const path = require("path");
const log4jsLogger = require("../middleware/logger");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

//-----------------
// Logger
//-----------------
const logger = log4jsLogger.default;

//-----------------
// Controller: getPosts
//-----------------

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  const ASCENDING_SORT = -1;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;

      return Post.find()
        .populate("creator", "_id name")
        .sort({ createdAt: ASCENDING_SORT })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      if (!posts) {
        const error = new Error("Could not fetch posts.");
        statusCode = 404;
        throw error;
      }

      logger.info("POSTS FETCHED");

      const resData = {
        message: "Posts Fetched Successfully.",
        posts: posts,
        totalItems: totalItems,
      };

      logger.debug(resData);

      res.status(200).json(resData);
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Controller: createPost
//-----------------
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;

  let creator;

  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });

  post
    .save()
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);

      return user.save();
    })
    .then((result) => {
      logger.info("USER POST CREATED");

      const resData = {
        message: "Post Created Successfully!",
        post: {
          ...post._doc,
          creator: { _id: req.userId, name: creator.name },
        },
      };

      logger.debug(resData);

      res.status(201).json(resData);
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Controller: getPost
//-----------------
exports.getPost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post with ID: " + postId);
        statusCode = 404;
        throw error;
      }

      logger.info("POST FETCHED");

      const resData = { message: "Post Fetched Successfully.", post: post };

      logger.debug(resData);

      res.status(200).json(resData);
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Controller: updatePost
//-----------------
exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  let imageUrl;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }

  logger.info("imageUrl: " + imageUrl);

  if (!imageUrl || typeof imageUrl === undefined) {
    const error = new Error("No image file selected.");
    error.statusCode = 422;
    throw error;
  }

  let updatedPost;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post with ID: " + postId);
        statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized To Update Post.");
        statusCode = 403;
        throw error;
      }

      // Delete the old image if there's a new image uploaded
      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.content = content;
      post.imageUrl = imageUrl;

      return post.save();
    })
    .then((result) => {
      updatedPost = result;

      return User.findById(req.userId);
    })
    .then((user) => {
      logger.info("POST UPDATED");

      const resData = {
        message: "Post Updated Successfully.",
        post: {
          ...updatedPost._doc,
          creator: { _id: req.userId, name: user.name },
        },
      };

      logger.debug(resData);

      res.status(200).json(resData);
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Controller: deletePost
//-----------------
exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post with ID: " + postId);
        statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not Authorized To Delete Post.");
        statusCode = 403;
        throw error;
      }

      // Delete the image
      clearImage(post.imageUrl);

      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      logger.info("POST DELETED");

      const resData = { message: "Post Deleted Successfully." };

      logger.debug(resData);

      res.status(200).json(resData);
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Helper Functions
//-----------------

//-----------------
// clearImage()
// Helper function when deleting/updating image
//-----------------

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath).replace("\\", "/");
  fs.unlink(filePath, (err) => {
    if (!Object.is(err, null)) {
      logger.error("clearImage Error: " + err);
    } else {
      logger.debug("IMAGE PATH UNLINKED: " + filePath.toString());
    }
  });
};
