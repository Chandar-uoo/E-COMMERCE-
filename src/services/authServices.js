const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const { userDetailsValidation } = require("../utils/validatons");
// signup
exports.signupService = async (req, res) => {

/* inputs*/
  const token = req.cookies.emailToken;
  const { name, email, password, address, image, gender, phoneNo, DOB } =
    req.body;

/* validatins*/
  if (!name || !email || !password || !gender || !phoneNo || !DOB) {
    throw new AppError("data is missing", 400);
  }
  if (!token) {
    throw new AppError("No emailToken verification token  found", 401);
  }
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded || !decoded.verified) {
    throw new AppError("email not verified ", 400);
  }
  
  await userDetailsValidation({name,decoded, email, phoneNo, gender, DOB });

  const hashedpassword = await bcrypt.hash(password, 10);
  const refreshKey = process.env.REFRESH_TOKEN;
  const accessKey = process.env.ACCESS_TOKEN;

/* user create */
  const newUser = await userModel.create({
    name,
    email,
    address,
    DOB,
    image,
    gender,
    phoneNo,
    password: hashedpassword,
    isVerified: decoded.verified,
  });
  const refreshToken = jwt.sign({ id: newUser._id }, refreshKey, {
    expiresIn: "5h",
  });
  const accessToken = jwt.sign({ id: newUser._id }, accessKey, {
    expiresIn: "15m",
  });
  return { newUser, refreshToken, accessToken };
};

// login

exports.loginService = async (req, res) => {
  /*input*/
  const { email, password } = req.body;
  const emailExist = await userModel.findOne({ email });

  /*input validations*/
  if (!emailExist) {
    throw new AppError("Invalid email or password", 400);
  }
  const verifyMatch = await bcrypt.compare(password, emailExist.password);
  if (!verifyMatch) {
    throw new AppError("Invalid email or password", 400);
  }
  const refreshKey = process.env.REFRESH_TOKEN;
  const accessKey = process.env.ACCESS_TOKEN;
  const refreshToken = await jwt.sign({ id: emailExist._id }, refreshKey, {
    expiresIn: "5h",
  });
  const accessToken = await jwt.sign({ id: emailExist._id }, accessKey, {
    expiresIn: "5h",
  });

  // return
  return { emailExist, refreshToken, accessToken };
};

// logout
exports.logoutService = (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
};

exports.accessTokenRenwal = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) {
    throw new AppError("No refreshToken found", 401);
  }
  const decoded = await jwt.verify(token, process.env.REFRESH_TOKEN);
  const user = await userModel.findById(decoded.id);
  if (!user) {
    throw new AppError("No user found", 401);
  }
  const accessKey = process.env.ACCESS_TOKEN;
  const accessToken = await jwt.sign({ id: user._id }, accessKey, {
    expiresIn: "5h",
  });

  return { accessToken };
};
