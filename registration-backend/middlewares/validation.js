const { body, validationResult } = require("express-validator");


const registrationRules = [
  body("fullName")
    .trim()
    .notEmpty().withMessage("Full name is required")
    .isLength({ min: 3 }).withMessage("Full name must be at least 3 characters"),

  body("dateOfBirth")
    .notEmpty().withMessage("Date of birth is required")
    .isISO8601().withMessage("Date of birth must be a valid date (YYYY-MM-DD)"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email"),

  body("phoneNumber")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .matches(/^(\+213|0)(5|6|7)\d{8}$/)
    .withMessage("Phone must be a valid Algerian number (e.g. 0612345678)"),

  body("isMember")
    .isBoolean().withMessage("isMember must be true or false"),

  body("isUsthbStudent")
    .isBoolean().withMessage("isUsthbStudent must be true or false"),

  body("motivation")
  .trim()
  .notEmpty().withMessage("Motivation is required")
  .isLength({ min: 5, max: 150 }).withMessage("Motivation must be between 5 and 150 characters"),
];


const checkErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
   
    return res.status(400).json({
      success: false,
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next(); 
};

module.exports = { registrationRules, checkErrors };