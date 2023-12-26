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
// Start the server
//-----------------

// Connect DB
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
