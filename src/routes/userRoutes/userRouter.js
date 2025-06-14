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
        result:user
    })
   } catch (err) {
    res.status(404).json({message:" something went wrong"});
    console.log(err); 
   }
})
 module.exports = {
    userRouter,
 } 