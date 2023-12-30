const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const appConfig = require("../appConfig.json");
const { validationResult } = require("express-validator");

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
      console.log("USER SIGNUP");
      return res
        .status(201)
        .json({ message: "User Created!", userId: result._id });
    })
    .then((result) => {
      transporter.sendMail({
        to: email,
        from: "testMailer@mailtrap.io",
        subject: "Signup succeeded!",
        html: "<h1>Hello " + name + ", you successfully signed up!</h1>",
      });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

//-----------------
// Controller: signUp
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

      console.log("USER LOGIN");

      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
