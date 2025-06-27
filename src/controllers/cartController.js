const express = require("express");
const productModel = require("../models/productModel");
const { default: mongoose } = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/AppError")
exports.addToCart = async (req, res) => {

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
            return res.status(200).json({
                success:true,
                message: "sucess of add",
                result: {
                    _id: findProduct._id
                }
            })

        }
        const newEntry = user.cart.push({
            productId: product._id,
            quantity: 1
        });

        await user.save();

        res.status(200).json({
            success:true,
            message: "successfull add to cart",
            result: user.cart[newEntry - 1]
        });
   
}
exports.readCart = async (req, res) => {

        const user = req.user;
        if (!req.user) {
            throw new AppError("Unauthorized", 401);
        }
        const data = user.cart;
        res.status(200).json({
            success:true,
            message: "sucees",
            result: data
        })
    
}
exports.updateCart = async(req,res)=>{

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
        res.status(200).json({
            success:true,
            message:"sucessful",
            data : findProduct,
        })

 }
 exports.deleteCart = async (req,res) => {
    
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
          res.status(200).json({
            sucess:true,
             message:"sucess",
             result:id
          })
  }