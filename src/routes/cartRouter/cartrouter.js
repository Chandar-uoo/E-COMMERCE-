const express = require("express");
const cartRouter = express.Router();
const {auth} = require("../../middleware/authValidator");
cartRouter.use(express.json());
const cartController = require("../../controllers/cartController");
const catchAsync  = require('../../utils/catchAsync')
// Add
 cartRouter.post("/add",auth,catchAsync(cartController.addToCart))
 // read
 cartRouter.get("/read",auth,catchAsync(cartController.readCart))
 // patch
 cartRouter.patch("/update",auth,catchAsync(cartController.updateCart))
 // delete
 cartRouter.delete("/delete",auth,catchAsync(cartController.deleteCart))
 // clear cart
cartRouter.delete("/clear",auth,catchAsync(cartController.clearCart))
 module.exports = {cartRouter,}