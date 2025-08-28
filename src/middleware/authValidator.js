const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const AppError = require("../utils/AppError");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(new AppError("Unauthorized", 401));
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

  const user = await userModel.findById(decoded.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  req.user = user;
  next(); // move to next middleware
};

module.exports = { auth };
