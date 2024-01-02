const log4js = require("log4js");
const path = require("path");

const LOG_PATH = path.join(__dirname, "..", "logs");

log4js.configure({
  appenders: {
    console: { type: "console" },
    file: { type: "file", filename: `${LOG_PATH}/app.log` },
  },
  categories: {
    default: { appenders: ["console"], level: "INFO" },
    file: { appenders: ["file"], level: "INFO" },
  },
});

module.exports = {
  default: log4js.getLogger("default"),
  file: log4js.getLogger("file"),
  express: log4js.connectLogger(log4js.getLogger("default"), {
    level: "AUTO",
    // statusRules: [
    //   { from: 200, to: 299, level: "debug" },
    //   { codes: [303, 304], level: "info" },
    // ],
    format: ":method :url",
    nolog: (req, res) => res.statusCode < 400,
  }),
};
