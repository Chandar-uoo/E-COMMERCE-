const express = require("express");
const userRouter = express.Router();
const {auth} = require('../../middleware/authValidator')
userRouter.use(express.json());

userRouter.get('/user',auth,(req,res)=>{
   try {
    const user = req.user;
    if(!user) res.status(404).json({message:"please login"});
    res.status(200).json({
        message:"user details",
        result:{
                        id:user._id,
                        name:user.name,
                        address:user.address,
                        DOB:user.DOB,
                        gender:user.gender,
                        image:user.image,
                        phoneNo:user.phoneNo,
                        cart:user.cart
                     }
    })
   } catch (err) {
    res.status(404).json({message:" something went wrong"});
    console.log(err); 
   }
})
 module.exports = {
    userRouter,
 } 