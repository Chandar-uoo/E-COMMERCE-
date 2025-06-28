const express = require("express");
const productModel = require("../models/productModel");
const { default: mongoose } = require("mongoose");
const validator = require("validator");
const AppError = require("../utils/AppError");

const cartServices = require("../services/cartServices");

exports.addToCart = async (req, res) => {

        const {newItem,user} = await cartServices.addToCartService(req,res);

        res.status(200).json({
            success:true,
            message: "successfully item added to cart",
            result: user.cart[newItem - 1]
        });
   
}
exports.readCart = async (req, res) => {

        const data = await cartServices.readCartService(req,res);

        res.status(200).json({
            success:true,
            message: "success of fetching data",
            result: data
        })
    
}
exports.updateCart = async(req,res)=>{

       const findProduct = await cartServices.updateCartService(req,res);

        res.status(200).json({
            success:true,
            message:"sucessful",
            data : findProduct,
        })

}
exports.deleteCart = async (req,res) => {
    const product = await cartServices.deleteCartServices(req,res);

          res.status(200).json({
            sucess:true,
             message:"sucess",
             result:product._id
          })
}