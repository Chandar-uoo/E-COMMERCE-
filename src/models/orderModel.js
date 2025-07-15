const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "userModel",
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "productModel",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
        }
    ],
    address: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["paid", "unpaid"],
        required: true,
        default: "unpaid",
    },
    payMethod: {
        type: String,
        enum: ["cod", "netPay", "idle"],
        default: "idle",
        required: true,
    },
    orderStatus: {
        type: String,
        enum: ["cancelled", "processing", "delivered", "shipped", "idle"],
        required: true,
        default: "idle"
    }
}, {
    timestamps: true,
})
module.exports = mongoose.model("order", orderModel);