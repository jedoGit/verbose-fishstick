const log4jsLogger = require("../middleware/logger");

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

    const resData = { status: "OK" };

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

    const resData = { status: "OK" };

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
