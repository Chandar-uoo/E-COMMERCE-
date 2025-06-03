const express = require("express");
const cartRouter = express.Router();
const {auth} = require("../../middleware/authValidator");
const productModel = require("../../models/productModel");
const { default: mongoose } = require("mongoose");
cartRouter.use(express.json());
const validator = require("validator")

// Add
 cartRouter.post("/cart/add/:id",auth,async (req,res) => {
   try {
    const user = req.user;  
    const {id} = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            message:"bad request"
        })
    }
     const product = await productModel.findById(id);
     if(!product){
        return res.status(400).json({
            message:"bad request"
        })
     }

     user.cart.push({
        productId:product._id,
        quantity:1
     });
     await user.save();
     res.status(200).json({
        message:"successfull add to cart"
     });
   } catch (err) {
    console.log(err);
    res.status(400).json({
        message:"something went wrong"
    })
    
   }
 })
 // read
 cartRouter.get("/cart/read",auth,async (req,res) => {
    const user = req.user;
    const data = user.cart;
    res.status(200).json({
        message:"sucees",
        result:data
    })
    
 })
 // patch
 cartRouter.patch("/cart/update/:id",auth,async(req,res)=>{
    try {
        const {id} = req.params;
        const {quantity} = req.body;
        if (!Number.isInteger(quantity)) {
            return res.status(400).json({ message: 'not valid' });
          }
        const user = req.user;
        const findProduct = user.cart.find(item => item.productId.toString() === id.toString());
        if(!findProduct){
            return res.status(200).json({
                message:"invalid details"
            })
        }
       const result = findProduct.quantity +=quantity;
        await user.save();
        res.status(200).json({
            data : result,
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            message:"something wrong"
        })
        
    }
 })
 module.exports = {cartRouter,}