// models/User.js
const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "details are not valid"
    }
  },
  password: {
    required: true,
    type: String
  },
  DOB: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    trim: true,
    required: true,

  },
  phoneNo: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isMobilePhone,
      message: "phone number is not valid"
    }
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Url is not valid"
    }
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true
  },
  role:{
    type:String,
    enum:["user","admin"],
    default:"user"
  },
  cart: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref:"productModel"
      },
      quantity: { type: Number }
    }
  ],
}
);
module.exports = mongoose.model("userModel", userSchema);
