import { body, check, validationResult,param } from "express-validator";

const registerValidator = () => [
  body("name", "Please enter your name").notEmpty(),
  body("username", "Please enter username").notEmpty(),
  body("bio", "Please enter bio").notEmpty(),
  body("password", "Please enter password").notEmpty(),
  check("avatar", "Please upload avatar").notEmpty(),
];

const loginValidator = () => [
  body("username", "Please enter your username").notEmpty(),
  body("password", "please enter your password").notEmpty(),
];


const sendRequestValidator = () =>{
  body("userId","Please enter userid ")
}

const validateValues = (req, res, next) => {
  const errors = validationResult(req);
  errors.array().map(({ msg }) => {
    console.log(msg);
  });
  const errorMessage = errors
    .array()
    .map(({ msg }) => msg)
    .join(",");
  console.log("error message are->", errorMessage);
  if (errors.isEmpty()) {
    next();
  }

  if (!errors.isEmpty()) {
    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};


// admin validator
const adminLoginValidator = () =>{
  body("secretKey","Please enter Secret key").notEmpty();
}


export {
  registerValidator,
  validateValues,
  loginValidator,
  sendRequestValidator,
  adminLoginValidator
};
