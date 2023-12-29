const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodeMailer = require("nodemailer");
const appConfig = require("../appConfig.json");
const { validationResult } = require("express-validator");

//-----------------
// Mailtrap.io Mailer service
//-----------------
const transporter = nodeMailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: appConfig.mailtrapIoUser,
    pass: appConfig.mailtrapIoPass,
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

  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email: email,
        password: hashedPw,
        name: name,
      });

      return user.save();
    })
    .then((result) => {
      return transporter.sendMail({
        to: email,
        from: "testMailer@mailtrap.io",
        subject: "Signup succeeded!",
        html: "<h1>Hello " + name + ", you successfully signed up!</h1>",
      });
    })
    .then((result) => {
      res.status(201).json({ message: "User Created!", userId: result._id });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });

  console.log("USER SIGNUP");
};
