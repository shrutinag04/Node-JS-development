const { body } = require("express-validator");
const { validationResult } = require("express-validator");
exports.validateId = (req, res, next) => {
  let itemId = req.params.id;
  if (itemId.match(/^[0-9a-fA-F]{24}$/)) {
    return next();
  } else {
    let err = new Error("Invalid item id");
    err.status = 400;
    //res.redirect('back');

    return next(err);
  }
};
exports.validateSignUp = [
  body("firstName", "FirstName cannot be empty").notEmpty().trim().escape(),
  body("lastName", "LastName cannot be empty").notEmpty().trim().escape(),
  body("email", "Email must be a valid address")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 characters and at most 64 characters"
  ).isLength({ min: 8, max: 64 }),
];

exports.validateLogIn = [
  body("email", "Email must be a valid address")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 characters and at most 64 characters"
  ).isLength({ min: 8, max: 64 }),
];

exports.validateItem = [
  body("name", "Name cannot be empty").notEmpty().trim().escape(),
  body("category", "LastName cannot be empty").notEmpty().trim().escape(),
  body("details", "Content cannot be empty")
    .trim()
    .escape()
    .isLength({ min: 10 }),
  body("status", "Status cannot be empty").notEmpty().trim().escape(),
  body("image", "Image path cannot be empty").notEmpty().trim().escape(),
  body("year", "Year cannot be empty").notEmpty().trim().escape(),
];

exports.validateResult = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("back");
  } else {
    return next();
  }
};
