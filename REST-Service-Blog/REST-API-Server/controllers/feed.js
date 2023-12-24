//-----------------
// Controller: getPosts
//-----------------

exports.getPosts = (req, res, next) => {
  console.log("GET POSTS");
  res.status(200).json({
    posts: [{ title: "First Post", content: "This is the first post!" }],
  });
};

//-----------------
// Controller: createPost
//-----------------
exports.createPost = (req, res, next) => {
  console.log("CREATE POST");

  const title = req.body.title;
  const content = req.body.content;

  // Create post in db
  res.status(201).json({
    posts: [
      {
        message: "Post Created Successfully!",
        post: { _id: new Date().toISOString(), title: title, content: content },
      },
    ],
  });
};
