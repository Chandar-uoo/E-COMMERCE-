const AppError = require("../utils/AppError");
const userModel = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../utils/email");
const { otpGenrator } = require("../utils/otpGenrator");
const verificationTokens = require("../models/verificationTokens");
const jwt = require("jsonwebtoken");
const { otpVerificationTemplate } = require("../utils/emailTemplates");
const { userUpdateDetailsValidations } = require("../utils/validatons");

exports.userCheckService = (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError("Please login", 401);
  }
  return user;
};

exports.updateUserDetailsService = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError("Please login", 401);
  }

  
  const { name, DOB, image, phoneNo, address } = req.body;

  if (!name || !DOB || !image || !phoneNo || !address) {
    throw new AppError("details are not provided", 400);
  }
  await userUpdateDetailsValidations({
    user,
    name,
    DOB,
    image,
    phoneNo,
    address,
  });

  const updateUser = userModel.findByIdAndUpdate(
    user._id,
    {
      name: name,
      DOB: DOB,
      image: image,
      phoneNo: phoneNo,
      address: address,
    },
    { new: true }
  );
  return updateUser;
};

exports.updateUserPasswordService = async (req, res) => {
  const user = req.user;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new AppError("Please enter details", 400);
  }
  const oldKey = oldPassword.trim();
  const isOldKeyValid = await bcrypt.compare(oldKey, user.password);
  if (!isOldKeyValid) {
    throw new AppError("old password is invalid", 401);
  }
  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  await userModel.findByIdAndUpdate(user._id, {
    password: newHashedPassword,
  });
};

exports.userEmailOtpSendService = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const existingEmail =  await  userModel.findOne({email:email})
  if(existingEmail){
      throw new AppError("email already present", 400);
  }
  if ( !email || !validator.isEmail(email)) {
    throw new AppError("invalid email", 400);
  }
  const otp = otpGenrator();
  const { subject, text } = otpVerificationTemplate(email, otp);
  await verificationTokens.deleteMany({
    email: email,
    purpose: "EMAIL_VERIFY",
  });
  await Promise.all([
    sendEmail({ to: email, subject, text }),
    verificationTokens.create({
      email: email,
      purpose: "EMAIL_VERIFY",
      otp: otp.toString(),
    }),
  ]);
};

exports.userEmailVerifyService = async (req, res) => {
  const { otp, email } = req.body;
  if (!otp) {
    throw new AppError("Bad Request", 400);
  }
  if (typeof otp !== "string") {
    throw new AppError("Invalid OTP", 400);
  }
  const data = await verificationTokens.findOne({
    email: email,
    purpose: "EMAIL_VERIFY",
  });

  if (!data || data.otp !== otp) {
    throw new AppError("invalid Otp ", 400);
  }
  const emailToken = jwt.sign(
    { email, verified: true, purpose: "signup" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  return { emailToken };
};
