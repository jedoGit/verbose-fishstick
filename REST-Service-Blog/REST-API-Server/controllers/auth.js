const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const log4jsLogger = require("../middleware/logger");
const appConfig = require("../appConfig.json");
const { validationResult } = require("express-validator");

//-----------------
// Logger
//-----------------
const logger = log4jsLogger.default;

//-----------------
// Mailtrap.io Mailer service
//-----------------
const transporter = nodeMailer.createTransport({
  host: appConfig.mailerHost,
  port: appConfig.mailerPort,
  auth: {
    user: appConfig.mailerUser,
    pass: appConfig.mailerPass,
  },
});

//-----------------
// Controller: signUp
//-----------------
exports.signUp = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const BCRYPTSALT = 12;

  bcrypt
    .hash(password, BCRYPTSALT)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
      });

      return user.save();
    })
    .then((result) => {
      logger.info("USER SIGN UP COMPLETE");

      const resData = { message: "User Created!", userId: result._id };

      logger.debug(resData);

      return res.status(201).json(resData);
    })
    .then((result) => {
      logger.info("USER SIGN UP EMAIL SENT");
      transporter.sendMail({
        to: email,
        from: "testMailer@mailtrap.io",
        subject: "Signup succeeded!",
        html: `<h1>Hello ${name}, you successfully signed up!</h1>
               <h1>You can now login and update your feeds.</h1>
        `,
      });
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Controller: login
//-----------------
exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User with this email could not be found.");
        error.statusCode = 401;
        throw error;
      }

      loadedUser = user;

      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("Password supplied did not match.");
        error.statusCode = 401;
        throw error;
      }

      // Setup the Json Web Token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        appConfig.jwtSecret,
        { expiresIn: appConfig.jwtTokenExpire }
      );

      logger.info("USER LOGGED IN");

      const resData = { token: token, userId: loadedUser._id.toString() };

      logger.debug(resData);

      res.status(200).json(resData);
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Controller: getUserStatus
//-----------------
exports.getUserStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        statusCode = 404;
        throw error;
      }

      logger.info("USER STATUS FETCHED");

      const resData = { status: user.status };

      logger.debug(resData);

      res.status(200).json(resData);
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Controller: updateUserStatus
//-----------------
exports.updateUserStatus = (req, res, next) => {
  const newStatus = req.body.status;
  User.findById(req.userId)
    .then((user) => {
      if (!user) {
        const error = new Error("Could not find user.");
        statusCode = 404;
        throw error;
      }

      user.status = newStatus;

      user.save();
    })
    .then((result) => {
      logger.info("USER STATUS UPDATED");

      const resData = { message: "User Status Updated." };

      logger.debug(resData);

      res.status(200).json(resData);
    })
    .catch((err) => {
      logger.error(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
