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
    const existingPhoneNo =  await userModel.findOne({phoneNo});
    if(existingPhoneNo){
        throw new AppError("user already present with this phone", 409)
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
    const refreshKey = process.env.REFRESH_TOKEN;
    const accessKey = process.env.ACCESS_TOKEN;
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
    const refreshToken = jwt.sign({ id: newUser._id }, refreshKey, { expiresIn: "5h" });
    const accessToken = jwt.sign({ id: newUser._id }, accessKey, { expiresIn: "15m" });
    return { newUser, refreshToken, accessToken }
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
    const refreshKey = process.env.REFRESH_TOKEN;
    const accessKey = process.env.ACCESS_TOKEN;
    const refreshToken = await jwt.sign({ id: emailExist._id }, refreshKey, { expiresIn: "5h" });
    const accessToken = await jwt.sign({ id: emailExist._id }, accessKey, { expiresIn: "5h" });


    // return
    return { emailExist, refreshToken, accessToken };
}

// logout
exports.logoutService = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
    });
}

exports.accessTokenRenwal = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No refreshToken found"
        })
    }
    const decoded = await jwt.verify(token, process.env.REFRESH_TOKEN);
    const user = await userModel.findById(decoded.id);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "user Not found"
        })
    }
    const accessKey = process.env.ACCESS_TOKEN;
    const accessToken = await jwt.sign({ id: user._id }, accessKey, { expiresIn: "5h" });

    return {accessToken};
}