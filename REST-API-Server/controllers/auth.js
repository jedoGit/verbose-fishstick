const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const log4jsLogger = require("../middleware/logger");
const { validationResult } = require("express-validator");

//-----------------
// Constants
//-----------------
const BCRYPTSALT = 12;

//-----------------
// Logger
//-----------------
const logger = log4jsLogger.default;

//-----------------
// Mailtrap.io Mailer service
//-----------------
const transporter = nodeMailer.createTransport({
  host: process.env.MAILER_HOST,
  port: process.env.MAILER_PORT,
  auth: {
    user: process.env.MAILER_USER,
    pass: process.env.MAILER_PASS,
  },
});

//-----------------
// Controller: signUp
//-----------------
exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed, entered data is incorrect.");
      error.statusCode = 422;
      error.data = errors.array();
      logger.error(error);
      throw error;
    }

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    const hashedPw = await bcrypt.hash(password, BCRYPTSALT);

    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
    });

    const dbDocument = await user.save();

    logger.info("USER INFO SAVED TO DB");

    const resData = { message: "User Created!", userId: dbDocument._id };

    logger.debug("User account data: " + JSON.stringify(resData));

    res.status(201).json(resData);

    logger.info("USER ACCOUNT CREATED");

    transporter.sendMail({
      to: email,
      from: "testMailer@mailtrap.io",
      subject: "Signup succeeded!",
      html: `<h1>Hello ${name}, you successfully signed up!</h1>
               <h1>You can now login and update your feeds.</h1>
        `,
    });

    logger.info("USER SIGN UP EMAIL SENT");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
  }
};

//-----------------
// Controller: login
//-----------------
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User with this email could not be found.");
      error.statusCode = 401;
      logger.error(error);
      throw error;
    }

    loadedUser = user;

    logger.debug("loadedUser: " + JSON.stringify(loadedUser));
    // logger.debug("req: " + JSON.stringify(req));

    const isEqual = await bcrypt.compare(password, user.password);

    logger.debug("isEqual: " + isEqual);

    if (!isEqual) {
      const error = new Error("Password supplied did not match.");
      error.statusCode = 401;
      logger.error(error);
      throw error;
    }

    // Setup the Json Web Token
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_TOKEN_EXPIRE }
    );

    if (!token) {
      const error = new Error("JWT token error.");
      error.statusCode = 401;
      logger.error(error);
      throw error;
    }

    logger.info("USER LOGGED IN");

    const resData = { token: token, userId: loadedUser._id.toString() };

    logger.debug("User login data: " + JSON.stringify(resData));

    res.status(200).json(resData);
    return;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
    return err;
  }
};

//-----------------
// Controller: getUserStatus
//-----------------
exports.getUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("Could not find user.");
      error.statusCode = 404;
      logger.error(error);
      throw error;
    }

    logger.info("USER STATUS FETCHED");

    const resData = { status: user.status };

    logger.debug("User status: " + JSON.stringify(resData));

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
// Controller: updateUserStatus
//-----------------
exports.updateUserStatus = async (req, res, next) => {
  const newStatus = req.body.status;

  try {
    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("Could not find user.");
      error.statusCode = 404;
      logger.error(error);
      throw error;
    }

    user.status = newStatus;

    const dbDocument = await user.save();

    logger.info("USER STATUS UPDATED");

    const resData = { message: "User Status Updated." };

    logger.debug(JSON.stringify(resData));

    res.status(200).json(resData);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    logger.error(err);
    next(err);
  }
};
