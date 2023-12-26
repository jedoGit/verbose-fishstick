const { validationResult } = require("express-validator");
const Post = require("../models/post");

//-----------------
// Controller: getPosts
//-----------------

exports.getPosts = (req, res, next) => {
  console.log("GET POSTS");
  Post.find()
    .then((posts) => {
      if (!posts) {
        const error = new Error("Could not fetch posts.");
        statusCode = 404;
        throw error;
      }
      res
        .status(200)
        .json({ message: "Posts Fetched Successfully.", posts: posts });
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

  const title = req.body.title;
  const content = req.body.content;

  console.log("CREATE POST");

  // Create post in db
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/itunesImage.jpg",
    creator: { name: "Jedo" },
  });

  post
    .save()
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
