const mongoose = require("mongoose");
const validator = require("validator");

const verificationTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: "details are not valid",
    },
  },
  purpose: {
    type: String,
    required: true,
    enum: ["EMAIL_VERIFY", "RESET_PASSWORD"],
  },
  otp: { type: String, required: true },

  createdAt: { type: Date, default: Date.now, expires: 300 },
});

module.exports = mongoose.model("VerificationToken", verificationTokenSchema);
