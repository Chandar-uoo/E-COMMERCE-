const AppError = require("../utils/AppError");
const userModel = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {isAtleast18} =  require("../utils/validators")
exports.userCheckService = (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError("Please login", 401);
    }
    return user;
}
exports.updateUserDetailsService =  async (req, res) => {
    const  user = req.user;
    if (!user) {
        throw new AppError("Please login", 401);
    }
    const {name,DOB,image,phoneNo,address} = req.body;

    if (!name || !DOB|| !image|| !phoneNo|| !address) {
        throw new AppError("details are not provided", 400);
    }
    const userName = name.toLowerCase().trim();
    if(userName.length < 2 || userName.length > 50 || !typeof userName === 'string' || !validator.isAlpha(userName, 'en-US', { ignore: ' ' })) {
        throw new AppError("invalid name", 400);
    }
    if (!isAtleast18(DOB)) {
        throw new AppError("You must be at least 18 years old", 400);
    }
     const existingPhoneNo =  await userModel.findOne({phoneNo});

    if (existingPhoneNo && !user.phoneNo === phoneNo || !validator.isMobilePhone(phoneNo) ) {
        throw new AppError("invalid phone number", 400);
    }
    if (!validator.isURL(image)) {
        throw new AppError("invalid image URL", 400);
    }
    if (!address || address.length < 10 || address.length > 100 || !typeof address === 'string') {
        throw new AppError("invalid address", 400);
    }
    const updateUser = userModel.findByIdAndUpdate(user._id, {
        name: userName,
        DOB: DOB,
        image: image,
        phoneNo:phoneNo,
        address: address
    }, {new: true});
    return updateUser;
}
exports.updateUserPasswordService = async (req,res) => {
    const user =  req.user;
    const {oldPassword,newPassword} =  req.body;
    if(!oldPassword || !newPassword) {
         throw new AppError("Please enter details", 400);
    }
    const oldKey = oldPassword.trim();
    const isOldKeyValid =  await bcrypt.compare(oldKey,user.password);
    if(!isOldKeyValid){
       throw new AppError("old password is invalid",401)
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedPassword =  await userModel.findByIdAndUpdate(user._id,{
        password:newHashedPassword,
    })
}