const { validationResult } = require("express-validator");
const Post = require("../models/post");

//-----------------
// Controller: getPosts
//-----------------

exports.getPosts = (req, res, next) => {
  console.log("GET POSTS");
  res.status(200).json({
    posts: [
      {
        _id: "1",
        title: "First Post",
        content: "This is the first post!",
        imageUrl: "images/itunesImage.jpg",
        creator: {
          name: "Jedo",
        },
        createdAt: new Date(),
      },
    ],
  });
};

//-----------------
// Controller: createPost
//-----------------
exports.createPost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed, entered data is incorrect.",
      errors: errors.array(),
    });
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
      console.log(err);
    });
};
