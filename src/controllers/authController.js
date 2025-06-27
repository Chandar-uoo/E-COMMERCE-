const validator = require("validator");
const {isAtleast18} = require('../utils/validators');
const userModel = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require('../utils/AppError')
exports.signup = async (req, res) => {
        const { name, email, password, address, image, gender, phoneNo, DOB } = req.body;
        if (!name || !email || !password || !image || !gender || !phoneNo || !DOB) {
            throw new AppError("data is missing",400);
        }
        if (!validator.isEmail(email)) {
            throw new AppError('Email not  valid',400);
        }
        const existing = await userModel.findOne({ email });
        if (existing) {
            throw new AppError("user already present with this email",409)
        }
        if (!validator.isURL(image)) {
            throw new AppError("Url not valid",400);
        }
        if (!validator.isMobilePhone(phoneNo)) {
            throw new AppError('phoneNo not valid',400);
        }
        const allowedGender = ["male", "female", "other"];
        if (!allowedGender.includes(gender)) {
            throw new AppError("Invalid gender value", 400);
        }
        if (!isAtleast18(DOB)) {
            throw new AppError("Only users aged 18 or above are allowed", 400);
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
           sucess:true,
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

}
exports.login = async (req,res) => {
        const {email,password} = req.body;
        const emailExist = await userModel.findOne({email});
        if(!emailExist){
            throw new AppError("Invalid email or password", 400);
        }
        const verifyMatch =  await bcrypt.compare(password,emailExist.password);
        if(!verifyMatch){
            throw new AppError("Invalid email or password", 400);
        };
        const secretkey = process.env.SECRET_KEY;
        const token = await jwt.sign({id:emailExist._id},secretkey,{expiresIn:"5h"});
        res.status(200).cookie('token',token,{
            httpOnly:true,
            secure:false,
            maxAge:5*60*60*1000
        }).json({
            success:true,
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
}