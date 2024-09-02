const log4jsLogger = require("../middleware/logger");
const mongoose = require("mongoose")

//-----------------
// Logger
//-----------------
const logger = log4jsLogger.default;

//-----------------
// Controller: getSystemHealth
//-----------------
exports.getSystemHealth = async (req, res, next) => {
  try {
    logger.info("SYSTEM HEALTH FETCHED");

    // Check connection to the database
    const dbState = mongoose.STATES[mongoose.connection.readyState];

    if ( dbState !== "connected" )
    {
      const error = new Error("Database Not Connected");
      error.statusCode = 404;
      throw error;
    }

    const resData = { status: "OK", dbState: dbState};

    logger.debug("System Health Status: " + JSON.stringify(resData));

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
// Controller: getSystemReady
//-----------------
exports.getSystemReady = async (req, res, next) => {
  try {
    logger.info("SYSTEM READY STATUS FETCHED");

    // Check connection to the database
    const dbState = mongoose.STATES[mongoose.connection.readyState];

    if ( dbState !== "connected" )
    {
      const error = new Error("Database Not Connected");
      error.statusCode = 404;
      throw error;
    }    

    const resData = { status: "OK", dbState: dbState};

    logger.debug("System Ready Status: " + JSON.stringify(resData));

    res.status(200).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
  }
};
