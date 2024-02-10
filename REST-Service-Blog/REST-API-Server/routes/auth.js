const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const authController = require("../controllers/auth");
const router = express.Router();
const User = require("../models/user");

//-----------------
// PUT: /signup
//-----------------
router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signUp
);

//-----------------
// POST: /login
//-----------------
router.post("/login", authController.login);

//-----------------
// GET: /status
//-----------------
router.get("/status", isAuth, authController.getUserStatus);

//-----------------
// PATCH: /status
//-----------------
router.patch(
  "/status",
  isAuth,
  [body("status").trim().not().isEmpty()],
  authController.updateUserStatus
);

// Export
module.exports = router;
