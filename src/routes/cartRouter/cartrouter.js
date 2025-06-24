const express = require("express");
const cartRouter = express.Router();
const {auth} = require("../../middleware/authValidator");
const productModel = require("../../models/productModel");
const { default: mongoose } = require("mongoose");
cartRouter.use(express.json());
const validator = require("validator");
const cartController = require("../../controllers/cartController")

// Add
 cartRouter.post("/cart/add/:id",auth,cartController.addToCart)
 // read
 cartRouter.get("/cart/read",auth,cartController.readCart)
 // patch
 cartRouter.patch("/cart/update/:id",auth,cartController.updateCart)
 // delete
 cartRouter.delete("/cart/delete/:id",auth,cartController.deleteCart)
 module.exports = {cartRouter,}