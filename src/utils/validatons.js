const userModel = require("../models/user");
const validator = require("validator");
const AppError = require("./AppError");

function isValidDOB(DOB) {
  const dob = new Date(DOB);
  return !isNaN(dob.getTime()); // ✅ returns true if valid date
}



const userDetailsValidation = async ({name,decoded,email,phoneNo,gender,DOB}) => {
     const userName = name.toLowerCase().trim();
  if (
    userName.length < 2 ||
    userName.length > 50 ||
    !typeof userName === "string" ||
    !validator.isAlpha(userName, "en-US", { ignore: " " })
  ) {
    throw new AppError("invalid name", 400);
  }
  if (!validator.isEmail(email) || decoded.email !== email) {
    throw new AppError("Email is  not  valid", 400);
  }
  const existing = await userModel.findOne({ email });
  if (existing) {
    throw new AppError("user already present with this email", 409);
  }
  const existingPhoneNo = await userModel.findOne({ phoneNo });
  if (existingPhoneNo) {
    throw new AppError("user already present with this phone", 409);
  }
  if (!validator.isMobilePhone(phoneNo, "en-IN")) {
    throw new AppError("phone Number not valid", 400);
  }
  const allowedGender = ["male", "female", "other"];
  if (!allowedGender.includes(gender)) {
    throw new AppError("Invalid gender value", 400);
  }
  if (!isValidDOB(DOB)) {
    throw new AppError("Date  format not valid", 400);
  }
};

const userUpdateDetailsValidations =  async ({name,DOB,phoneNo,user,image,address}) => {
    const userName = name.toLowerCase().trim();
  if (
    userName.length < 2 ||
    userName.length > 50 ||
    !typeof userName === "string" ||
    !validator.isAlpha(userName, "en-US", { ignore: " " })
  ) {
    throw new AppError("invalid name", 400);
  }
  if (!isValidDOB(DOB)) {
    throw new AppError("You must be at least 18 years old", 400);
  }
  const existingPhoneNo = await userModel.findOne({ phoneNo });

  if (
    (existingPhoneNo && !user.phoneNo === phoneNo) ||
    !validator.isMobilePhone(phoneNo)
  ) {
    throw new AppError("invalid phone number", 400);
  }
  if (!validator.isURL(image)) {
    throw new AppError("invalid image URL", 400);
  }
  if (
    !address ||
    address.length < 10 ||
    address.length > 100 ||
    !typeof address === "string"
  ) {
    throw new AppError("invalid address", 400);
  }
}
  module.exports = {isValidDOB,userDetailsValidation,userUpdateDetailsValidations}