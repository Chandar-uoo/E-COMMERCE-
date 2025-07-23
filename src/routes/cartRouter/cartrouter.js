const express = require("express");
const cartRouter = express.Router();
const {auth} = require("../../middleware/authValidator");
const productModel = require("../../models/productModel");
const { default: mongoose } = require("mongoose");
cartRouter.use(express.json());
const validator = require("validator");
const cartController = require("../../controllers/cartController");
const catchAsync  = require('../../utils/catchAsync')
// Add
 cartRouter.post("/add/:id",auth,catchAsync(cartController.addToCart))
 // read
 cartRouter.get("/read",auth,catchAsync(cartController.readCart))
 // patch
 cartRouter.patch("/update/:id",auth,catchAsync(cartController.updateCart))
 // delete
 cartRouter.delete("/delete/:id",auth,catchAsync(cartController.deleteCart))
 // clear cart
cartRouter.delete("/clear",auth,catchAsync(cartController.clearCart))
 module.exports = {cartRouter,}