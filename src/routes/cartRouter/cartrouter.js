const express = require("express");
const cartRouter = express.Router();
const {auth} = require("../../middleware/authValidator");
const productModel = require("../../models/productModel");
const { default: mongoose } = require("mongoose");
cartRouter.use(express.json());
const validator = require("validator");
const cartController = require("../../controllers/cartController")

// Add
 cartRouter.post("/add/:id",auth,cartController.addToCart)
 // read
 cartRouter.get("/read",auth,cartController.readCart)
 // patch
 cartRouter.patch("/update/:id",auth,cartController.updateCart)
 // delete
 cartRouter.delete("/delete/:id",auth,cartController.deleteCart)
 module.exports = {cartRouter,}