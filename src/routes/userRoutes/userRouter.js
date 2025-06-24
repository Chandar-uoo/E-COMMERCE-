const express = require("express");
const userRouter = express.Router();
const {auth} = require('../../middleware/authValidator')
userRouter.use(express.json());
const userController = require("../../controllers/userController")
userRouter.get('/userCheck',auth,userController.userCheck)
 module.exports = {
    userRouter,
 } 