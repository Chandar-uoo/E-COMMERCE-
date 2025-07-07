const validator = require("validator");
const { isAtleast18 } = require("../utils/validators");
const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

// signup
exports.signupService = async (req, res) => {
    const { name, email, password, address, image, gender, phoneNo, DOB } = req.body;
    if (!name || !email || !password || !image || !gender || !phoneNo || !DOB) {
        throw new AppError("data is missing", 400);
    }
    if (!validator.isEmail(email)) {
        throw new AppError('Email not  valid', 400);
    }
    const existing = await userModel.findOne({ email });
    if (existing) {
        throw new AppError("user already present with this email", 409)
    }
    if (!validator.isURL(image)) {
        throw new AppError("Url not valid", 400);
    }
    if (!validator.isMobilePhone(phoneNo)) {
        throw new AppError('phoneNo not valid', 400);
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
    return { newUser, token }
}

// login 

exports.loginService = async (req, res) => {
    const { email, password } = req.body;
    const emailExist = await userModel.findOne({ email });
    if (!emailExist) {
        throw new AppError("Invalid email or password", 400);
    }
    const verifyMatch = await bcrypt.compare(password, emailExist.password);
    if (!verifyMatch) {
        throw new AppError("Invalid email or password", 400);
    };
    const secretkey = process.env.SECRET_KEY;
    const token = await jwt.sign({ id: emailExist._id }, secretkey, { expiresIn: "5h" });

    // return
    return { emailExist, token };
}

// logout
exports.logoutService = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });
}

userModel.updateMany({},{$set:{role:"user"}});