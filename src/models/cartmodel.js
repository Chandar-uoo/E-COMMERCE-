const { default: mongoose } = require("mongoose");

const cartModel = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "productModel",
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
      priceAtTheTime: {
        type: Number,
        required: true,
      },
    },
  ],
  totalQuantity: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("cartModel", cartModel);