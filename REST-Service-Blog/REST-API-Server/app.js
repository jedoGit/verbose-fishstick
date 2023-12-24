const express = require("express");
const bodyParser = require("body-parser");
const feedRoutes = require("./routes/feed");
const app = express();

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
app.listen(8081);
