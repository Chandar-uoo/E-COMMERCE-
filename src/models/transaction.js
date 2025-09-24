const { default: mongoose } = require("mongoose");

const transactionSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "orderModel", // optional: reference to Order model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "userModel", // optional: reference to User model
  },
  paymentId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // auto adds createdAt and updatedAt
});

module.exports = mongoose.model("transactionModel", transactionSchema);
