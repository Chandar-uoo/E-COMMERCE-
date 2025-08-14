const express = require("express");
const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
const AppError = require('../utils/AppError');
const userModel = require("../models/user");
const cartModel =  require("../models/cartmodel");

exports.addToCartService = async (req, res) => {

    const user = req.user;
    if (!req.user) {
        throw new AppError("Unauthorized", 401);
    }
    const { productId,quantity } = req.body;
     if(quantity <= 0){
        throw new AppError ("Bad request - quantity must be valid",400)
     }

    if ( !productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError("Bad Request", 400);
    }

    const product = await productModel.findById(productId);
    if (!product) {
        throw new AppError(" no Product found", 404);
    }
     // if a user has cart document not exist 
    const cart = await cartModel.findOne({user:user._id});

    if(!cart){
    // CASE 1: Cart doesn't exist — create new one
    const newCart =  cartModel.create({
      user: user._id,
      items: [{
        product:productId,
        quantity,
        priceAtTheTime: product.price,
      }],
      totalQuantity: quantity,
      totalPrice: product.price * quantity,
    });
     await cart.populate("items.product","title price thumbnail category description ");
    return newCart;
    }
    
  // CASE 2: Cart exists
  // Check if product is already in cart
  const itemIndex = cart.items.findIndex(item =>
    item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // CASE 2a: Product already exists in cart
    const currQuantity =  cart.items[itemIndex].quantity;
    cart.items[itemIndex].quantity += quantity;
      cart.totalQuantity +=  quantity;
const itemTotal = product.price * quantity;
cart.totalPrice += parseFloat(itemTotal.toFixed(2));
  } else {
    // CASE 2b: Product not in cart yet
    cart.items.push({
      product: productId,
      quantity,
      priceAtTheTime: product.price,
    });
    cart.totalQuantity += quantity;
const itemTotal = product.price * quantity;
cart.totalPrice += parseFloat(itemTotal.toFixed(2));
  }
  cart.updatedAt = new Date();
  await cart.save();
   await cart.populate("items.product","title price thumbnail category description ");
  return cart;
}

exports.readCartService = async (req, res) => {

        const user = req.user;
        if (!user) {
            throw new AppError("Unauthorized", 403);
        }
        const cart  = await cartModel.findOne({user:user._id}).populate("items.product","title price thumbnail category description ").lean()
        return cart;
}

exports.updateCartService = async(req,res)=>{
    const user = req.user;
    if(!user){
         throw new AppError("Unauthorized", 403);
    }
    const {productId,quantity} = req.body;

    if ( !productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError("Bad Request", 400);
    }
    const product = await productModel.findById(productId);
    if(!product){
        throw new AppError("no product found", 404);
    }
    if (!Number.isInteger(quantity)) {
        throw new AppError("Quantity must be an integer", 400);
    }

    
    const cart = await cartModel.findOne({user:user._id});
    const itemIndex = cart.items.findIndex(item =>
    item.product.toString() === productId
  );

  if (itemIndex > -1) {
    // CASE 2a: Product already exists in cart
     const currQuantity =  cart.items[itemIndex].quantity;
    cart.items[itemIndex].quantity = quantity;
     if(quantity < currQuantity){
      
      cart.totalQuantity -= currQuantity - quantity;
     }
     else{
      cart.totalQuantity +=  quantity - currQuantity;
     }
    const itemTotal = product.price * quantity;
cart.totalPrice += parseFloat(itemTotal.toFixed(2));
    await cart.save();
    return cart;
}
}

exports.deleteCartServices = async (req,res) => {
  
    const {productId} = req.body;
    const user = req.user;
    if ( !productId || !mongoose.Types.ObjectId.isValid(productId)) {
       throw new AppError("Bad Request: Invalid ID", 400);
   }
     const product = await productModel.findById(productId);
     if (!product) {
       throw new AppError("Product not found", 404);
   }
   const cart =  await cartModel.findOne({user:user._id});
// Filter out all entries for the given product
  const newItems = cart.items.filter(
    item => item.product.toString() !== productId
  );

  if (newItems.length === cart.items.length) {
    throw new Error("Product not found in cart");
  }

  // Recalculate totals
  let newTotalPrice = 0;
  let newTotalQuantity = 0;

  newItems.forEach(item => {
    newTotalPrice += item.quantity * item.priceAtTheTime;
    newTotalQuantity += item.quantity;
  });

  // Update cart
  cart.items = newItems;
  cart.totalPrice =  parseFloat(newTotalPrice.toFixed(2));
  cart.totalQuantity = newTotalQuantity;
  cart.updatedAt = new Date();

  await cart.save();
  return cart;
}


exports.clearCartService = async(req,res)=>{
  const user = req.user;
  if(!user){
    throw new AppError("unAuthorized",403);
  }
  const cart =  await cartModel.findOne({user:user._id});
   if (!cart) throw new AppError("Cart not found",404);
    cart.items = [];
   cart.totalPrice = 0;
   cart.totalQuantity = 0;
   cart.updatedAt = new Date();

  await cart.save();
  return cart;  
}