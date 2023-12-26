const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const appConfig = require("./appConfig.json");
const feedRoutes = require("./routes/feed");
const app = express();

//-----------------
// Constants
//-----------------
const MONGODB_URI = appConfig.dbUri;

//-----------------
// Register Parsers
//-----------------
app.use(bodyParser.json()); // parse application/json content-type
app.use("/images", express.static(path.join(__dirname, "images")));

//-----------------
// CORS Policy for all responses
//-----------------
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//-----------------
// Register Routes
//-----------------
app.use("/feed", feedRoutes);

//-----------------
// Register Error handler middleware
//-----------------
app.use((error, req, res, next) => {
  console.log(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  res.status(statusCode).json({ message: message });
});

//-----------------
// Start the server
//-----------------
// Connect DB
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(8081);
  })
  .catch((err) => {
    console.log(err);
  });
