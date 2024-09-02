const jwt = require("jsonwebtoken");
const log4jsLogger = require("../middleware/logger");

//-----------------
// Logger
//-----------------
const logger = log4jsLogger.default;

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    const error = new Error(
      "Missing Authorization Header from received request."
    );
    logger.error("Missing Authorization Header from received request.");
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(" ")[1];

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    logger.error("Error with jwt.verify call.");
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    logger.error("Error with decoded user token.");
    const error = new Error("Error with decoded user token.");
    error.statusCode = 401;
    throw error;
  }

  logger.info("USER TOKEN DECODED");

  req.userId = decodedToken.userId;

  logger.debug("userId: " + req.userId);
  next();
};
