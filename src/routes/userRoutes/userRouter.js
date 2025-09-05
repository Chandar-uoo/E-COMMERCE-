const express = require("express");
const userRouter = express.Router();
const {auth} = require('../../middleware/authValidator')
userRouter.use(express.json());
const userController = require("../../controllers/userController");
const catchAsync = require("../../utils/catchAsync")
userRouter.get('/userCheck',auth,catchAsync(userController.userCheck))
userRouter.patch("/updateUser",auth,catchAsync(userController.updateUserDetails))
userRouter.patch("/updatePassword",auth,catchAsync(userController.updateUserPassword))
userRouter.post("/send-verification-otp",catchAsync(userController.userEmailOtpSend))
userRouter.post("/verify-otp",catchAsync(userController.userEmailVerify))
 module.exports = {
    userRouter,
 } 