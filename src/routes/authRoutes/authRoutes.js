const express = require("express");
const authRouter = express.Router();
authRouter.use(express.json());

const authController = require("../../controllers/authController")

// signup
authRouter.post("/signup", authController.signup);
// login
authRouter.post("/login",authController.login);

module.exports = { authRouter }