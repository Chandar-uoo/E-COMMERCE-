const express = require("express");
const authRouter = express.Router();
authRouter.use(express.json());
const catchAsync = require('../../utils/catchAsync')
const authController = require("../../controllers/authController")

// signup
authRouter.post("/signup", catchAsync(authController.signup));
// login
authRouter.post("/login",catchAsync(authController.login));
// logout
authRouter.get('/logout',catchAsync(authController.logout));
// access token renewal
authRouter.post('/refresh-token',catchAsync(authController.refreshToken))
module.exports = { authRouter }