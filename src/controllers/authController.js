const validator = require("validator");
const { isAtleast18 } = require('../utils/validators');
const userModel = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require('../utils/AppError');
const authServices = require("../services/authServices")
exports.signup = async (req, res) => {

    const { newUser, token } = await authServices.signupService(req, res);

    res.status(200).cookie('token', token, { httpOnly: true, secure: false, maxAge: 5 * 60 * 60 * 1000, sameSite: true }).json({
        sucess: true,
        message: "successfully user created",
        result: {
            id: newUser._id,
            name: newUser.name,
            address: newUser.address,
            DOB: newUser.DOB,
            gender: newUser.gender,
            image: newUser.image,
            phoneNo: newUser.phoneNo,
            cart: newUser.cart
        }
    })

}
exports.login = async (req, res) => {
    const { emailExist, token } = await authServices.loginService(req, res);
    res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 5 * 60 * 60 * 1000
    }).json({
        success: true,
        message: "login sucessfull",
        result: {
            id: emailExist._id,
            name: emailExist.name,
            address: emailExist.address,
            DOB: emailExist.DOB,
            gender: emailExist.gender,
            image: emailExist.image,
            phoneNo: emailExist.phoneNo,
            cart: emailExist.cart
        }
    })
}

exports.logout = async (req,res)=>{
    const logoutUser =  await authServices.logoutService(req,res);
    res.status(200).json({
        success:true,
        message:"logout Suceesfully"
    })
}