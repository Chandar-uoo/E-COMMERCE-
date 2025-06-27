const express = require("express");
const authRouter = express.Router();
authRouter.use(express.json());
const catchAsync = require('../../utils/catchAsync')
const authController = require("../../controllers/authController")

// signup
authRouter.post("/signup", catchAsync(authController.signup));
// login
authRouter.post("/login",catchAsync(authController.login));

module.exports = { authRouter }