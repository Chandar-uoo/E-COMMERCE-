const express = require("express");
const authRouter = express.Router();
authRouter.use(express.json());
const validator = require("validator")
const { isAtleast18 } = require("../../utils/validators")
const userModel = require("../../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
    try {
        const { name, email, password, address, image, gender, phoneNo, DOB } = req.body;
        if (!name || !email || !password || !image || !gender || !phoneNo || !DOB) {
            return res.status(400).json({
                message: "data is missing"
            })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "email not valid"
            })
        }
        const existing = await userModel.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "user already present in this email" })
        }
        if (!validator.isURL(image)) {
            return res.status(400).json({
                message: "Url not valid"
            })
        }
        if (!validator.isMobilePhone(phoneNo)) {
            return res.status(400).json({ message: " phoneNo not valid " })
        }
        const allowedGender = ["male", "female", "other"];
        if (!allowedGender.includes(gender)) {
            return res.status(400).json({
                message: "gender details not valid"
            })
        }
        if (!isAtleast18(DOB)) {
            return res.status(400).json({
                message: "only 18+ is allowed"
            })
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        const secretkey = process.env.SECRET_KEY;
        const newUser = await userModel.create({
            name,
            email,
            address,
            DOB,
            image,
            gender,
            phoneNo,
            password: hashedpassword
        })
        const token = jwt.sign({ id: newUser._id }, secretkey, { expiresIn: "5h" });
        res.status(200).cookie('token', token, { httpOnly: true, secure: false, maxAge: 5 * 60 * 60 * 1000, sameSite: true }).json({
            message: "success of creation",
            result:{
                id:newUser._id,
                name:newUser.name,
                address:newUser.address,
                DOB:newUser.DOB,
                gender:newUser.gender,
                image:newUser.image,
                phoneNo:newUser.phoneNo,
                cart:newUser.cart
             }
        })

    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "something went wrong"
        })

    }
})
authRouter.post("/login",async (req,res) => {
    try {
        const {email,password} = req.body;
        const emailExist = await userModel.findOne({email});
        if(!emailExist){
            return res.status(400).json({
                message:"email not found"
            })
        }
        const verifyMatch =  await bcrypt.compare(password,emailExist.password);
        if(!verifyMatch){
            return res.status(400).json({
                message:"password wrong"
            })
        };
        const secretkey = process.env.SECRET_KEY;
        const token = await jwt.sign({id:emailExist._id},secretkey,{expiresIn:"5h"});
        res.status(200).cookie('token',token,{
            httpOnly:true,
            secure:false,
            maxAge:5*60*60*1000
        }).json({
            message:"login sucessfull",
            result:{
               id:emailExist._id,
               name:emailExist.name,
               address:emailExist.address,
               DOB:emailExist.DOB,
               gender:emailExist.gender,
               image:emailExist.image,
               phoneNo:emailExist.phoneNo,
               cart:emailExist.cart
            }
        })


    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "something went wrong"
        })
    }

    
})
module.exports = { authRouter }