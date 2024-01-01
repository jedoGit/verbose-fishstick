const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

//-----------------
// Controller: getPosts
//-----------------

exports.getPosts = (req, res, next) => {
  console.log("GET POSTS");

  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;

      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      if (!posts) {
        const error = new Error("Could not fetch posts.");
        statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "Posts Fetched Successfully.",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      console.log(err);
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
  let post;

  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        statusCode = 404;
        throw error;
      }

      creator = user;

      // Create post in db
      const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: { _id: req.userId, name: user.name },
      });

      return post.save();
    })
    .then((savedPost) => {
      post = savedPost;
      creator.posts.push(post);
      return creator.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post Created Successfully!",
        post: post,
      });
    })
    .catch((err) => {
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

  console.log("GET POST");

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post with ID: " + postId);
        statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: "Post Fetched Successfully.", post: post });
    })
    .catch((err) => {
      console.log(err);
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

  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }

  if (!imageUrl) {
    const error = new Error("No file selected.");
    error.statusCode = 422;
    throw error;
  }

  console.log("UPDATE POST");

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post with ID: " + postId);
        statusCode = 404;
        throw error;
      }

      if (post.creator._id.toString() !== req.userId) {
        const error = new Error("Not Authorized.");
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
      res
        .status(200)
        .json({ message: "Post Updated Successfully.", post: result });
    })
    .catch((err) => {
      console.log(err);
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

  console.log("DELETE POST");

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post with ID: " + postId);
        statusCode = 404;
        throw error;
      }

      if (post.creator._id.toString() !== req.userId) {
        const error = new Error("Not Authorized.");
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
      res.status(200).json({ message: "Post Deleted Successfully." });
    })
    .catch((err) => {
      console.log(err);
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
//             Helper function when deleting/updating image
//-----------------

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath).replace("\\", "/");
  fs.unlink(filePath, (err) => {
    if (!Object.is(err, null)) {
      console.log("clearImage Error: " + err);
    }
  });
};
