const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref:"productModel",
        required: true
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref:"userModel",
        required: true
    },
    address: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        required: true
    },
    payMethod: {
        type: String,
        enum: ["cod", "netPay","idle"],
        default:"idle",
        required: true
    },
    orderStatus: {
        type: String,
        enum: ["pending","processing", "delivered", "failure", "shipped", "idle"],
        required: true
    }
}, {
    timestamps: true,
})
module.exports = mongoose.model("order", orderModel);