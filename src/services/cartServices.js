const express = require("express");
const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
const AppError = require('../utils/AppError');

exports.addToCartService = async (req, res) => {

    const user = req.user;
    if (!req.user) {
        throw new AppError("Unauthorized", 401);
    }
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Bad Request", 400);
    }
    const product = await productModel.findById(id);
    if (!product) {
        throw new AppError("Bad Request", 400);
    }
    const findProduct = user.cart.find(item => item.productId.toString() === id.toString());
    if (findProduct) {
        findProduct.quantity += 1;
        await user.save();
        return {
            handled:true,
            data:findProduct._id,
        } 

    }
    const newItem = user.cart.push({
        productId: product._id,
        quantity: 1
    });

    await user.save();
    return {newItem,user};
}

exports.readCartService = async (req, res) => {

        const user = req.user;
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        await user.populate("cart.productId","ProductName price img category description ")
        const data = user.cart;
        return data;
}

exports.updateCartService = async(req,res)=>{

    const {id} = req.params;
    const {quantity} = req.body;
    if (!Number.isInteger(quantity)) {
        throw new AppError("Quantity must be an integer", 400);
    }
    const user = req.user;
    const findProduct = user.cart.find(item => item.productId.toString() === id.toString());
    if (!findProduct) {
        throw new AppError("Invalid details", 400);
    }
   const result = findProduct.quantity +=quantity;
    await user.save();
    return findProduct;
}

exports.deleteCartServices = async (req,res) => {
    
    const {id} = req.params;
    const user = req.user;
    if (!mongoose.Types.ObjectId.isValid(id)) {
       throw new AppError("Bad Request: Invalid ID", 400);
   }
     const product = await productModel.findById(id);
     if (!product) {
       throw new AppError("Product not found", 400);
   }
     user.cart = user.cart.filter(item => item.productId.toString() !== id.toString());

     await user.save();

     return product;
}