const fs = require("fs");
const path = require("path");
const log4jsLogger = require("../middleware/logger");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

//-----------------
// Constants
//-----------------
const ASCENDING_SORT = -1;
const ITEMS_PER_PAGE = 2;
const PAGE_ONE = 1;

//-----------------
// Logger
//-----------------
const logger = log4jsLogger.default;

//-----------------
// Controller: getPosts
//-----------------

exports.getPosts = async (req, res, next) => {
  try {
    const currentPage = req.query.page || PAGE_ONE;

    const totalItems = await Post.find().countDocuments();

    const posts = await Post.find()
      .populate("creator", "_id name")
      .sort({ createdAt: ASCENDING_SORT })
      .skip((currentPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);

    if (!posts) {
      const error = new Error("Could not fetch posts.");
      error.statusCode = 404;
      throw error;
    }

    logger.info("POSTS FETCHED");

    const resData = {
      message: "Posts Fetched Successfully.",
      posts: posts,
      totalItems: totalItems,
    };

    logger.debug("Posts: " + JSON.stringify(resData));

    res.status(200).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
  }
};

//-----------------
// Controller: createPost
//-----------------
exports.createPost = async (req, res, next) => {
  try {
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

    // Create post in db
    const post = new Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });

    const postDocument = await post.save();

    const creatorDocument = await User.findById(req.userId);

    creatorDocument.posts.push(post);

    const userSaveDocument = await creatorDocument.save();

    logger.info("USER POST CREATED");

    const resData = {
      message: "Post Created Successfully!",
      post: {
        ...post._doc,
        creator: { _id: req.userId, name: creatorDocument.name },
      },
    };

    logger.debug(JSON.stringify(resData));

    res.status(201).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
  }
};

//-----------------
// Controller: getPost
//-----------------
exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const postDocument = await Post.findById(postId);

    if (!postDocument) {
      const error = new Error("Could not find post with ID: " + postId);
      error.statusCode = 404;
      throw error;
    }

    logger.info("POST FETCHED");

    const resData = {
      message: "Post Fetched Successfully.",
      post: postDocument,
    };

    logger.debug(JSON.stringify(resData));

    res.status(200).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
  }
};

//-----------------
// Controller: updatePost
//-----------------
exports.updatePost = async (req, res, next) => {
  const errors = validationResult(req);

  try {
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

    const postDocument = await Post.findById(postId);

    if (!postDocument) {
      const error = new Error("Could not find post with ID: " + postId);
      error.statusCode = 404;
      throw error;
    }

    if (postDocument.creator.toString() !== req.userId) {
      const error = new Error("Not Authorized To Update Post.");
      error.statusCode = 403;
      throw error;
    }

    // Delete the old image if there's a new image uploaded
    if (imageUrl !== postDocument.imageUrl) {
      clearImage(postDocument.imageUrl);
    }

    postDocument.title = title;
    postDocument.content = content;
    postDocument.imageUrl = imageUrl;

    const postSaveDocument = await postDocument.save();

    const userDocument = await User.findById(req.userId);

    logger.info("POST UPDATED");

    const resData = {
      message: "Post Updated Successfully.",
      post: {
        ...postSaveDocument._doc,
        creator: { _id: req.userId, name: userDocument.name },
      },
    };

    logger.debug(JSON.stringify(resData));

    res.status(200).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
  }
};

//-----------------
// Controller: deletePost
//-----------------
exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const postDocument = await Post.findById(postId);

    if (!postDocument) {
      const error = new Error("Could not find post with ID: " + postId);
      error.statusCode = 404;
      throw error;
    }

    if (postDocument.creator.toString() !== req.userId) {
      const error = new Error("Not Authorized To Delete Post.");
      error.statusCode = 403;
      throw error;
    }

    // Delete the image
    clearImage(postDocument.imageUrl);

    const postDeleteDocument = await Post.findByIdAndDelete(postId);

    const userFindDocument = await User.findById(req.userId);

    userFindDocument.posts.pull(postId);

    const userSaveDocument = await userFindDocument.save();

    logger.info("POST DELETED");

    const resData = { message: "Post Deleted Successfully." };

    logger.debug(JSON.stringify(resData));

    res.status(200).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
  }
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
