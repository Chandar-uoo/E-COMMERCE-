const express = require("express");
const productModel = require("../models/productModel");
const { default: mongoose } = require("mongoose");
const validator = require("validator");

exports.addToCart = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "bad request"
            })
        }
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(400).json({
                message: "bad request"
            })
        }
        const findProduct = user.cart.find(item => item.productId.toString() === id.toString());
        if (findProduct) {
            findProduct.quantity += 1;
            await user.save();
            return res.status(200).json({
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
            message: "successfull add to cart",
            result: user.cart[newEntry - 1]
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "something went wrong"
        })

    }
}
exports.readCart = async (req, res) => {
    try {
        const user = req.user;
        const data = user.cart;
        res.status(200).json({
            message: "sucees",
            result: data
        })
    } catch (err) {
        res.status(500).json({
            message: 'something went wrong'
        })
    }
}
exports.updateCart = async(req,res)=>{
    try {
        const {id} = req.params;
        const {quantity} = req.body;
        if (!Number.isInteger(quantity)) {
            return res.status(400).json({ message: 'not valid' });
          }
        const user = req.user;
        const findProduct = user.cart.find(item => item.productId.toString() === id.toString());
        if(!findProduct){
            return res.status(400).json({
                message:"invalid details"
            })
        }
       const result = findProduct.quantity +=quantity;
        await user.save();
        res.status(200).json({
            data : findProduct,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message:"something wrong"
        })
        
    }
 }
 exports.deleteCart = async (req,res) => {
     try {
         const {id} = req.params;
         const user = req.user;
         if(!mongoose.Types.ObjectId.isValid(id)){
             return res.status(400).json({
                 message:"bad request"
             })
         }
          const product = await productModel.findById(id);
          if(!product) {
             return res.status(400).json({
                 message:"failed"
             })
          }
          user.cart = user.cart.filter(item => item.productId.toString() !== id.toString());
          await user.save();
          res.status(200).json({
             message:"sucess",
             result:id
          })
     } catch (err) {
         console.log(err);
         return res.status(500).json({
             message:"something went wrong"
         })
         
     }
  }