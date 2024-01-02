const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const log4jsLogger = require("./middleware/logger");
const mongoose = require("mongoose");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const mime = require("mime-types");
const appConfig = require("./appConfig.json");
const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");
const app = express();

//-----------------
// Register Logger
//-----------------
app.use(log4jsLogger.express);
const logger = log4jsLogger.default;

//-----------------
// Image Filestorage
//-----------------
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    // cb(null, new Date().toISOString() + "-" + file.originalname);
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const uniqueSuffix = uuidv4();
    const mimeType = mime.lookup(file.originalname);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + mime.extension(mimeType)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//-----------------
// Register Parsers
//-----------------
app.use(bodyParser.json()); // parse application/json content-type
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
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
app.use("/auth", authRoutes);

//-----------------
// Register Error handler middleware
//-----------------
app.use((error, req, res, next) => {
  logger.error(error);
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({ message: message, data: data });
});

//-----------------
// Start the server
//-----------------
// Connect DB
mongoose
  .connect(appConfig.dbUri)
  .then((result) => {
    logger.info("APP STARTED");
    app.listen(8081);
  })
  .catch((err) => {
    logger.error(err);
  });
