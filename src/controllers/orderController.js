const orderModel = require("../models/orderModel.js");
const productModel = require('../models/productModel.js');
const { default: mongoose } = require("mongoose");
const AppError = require("../utils/AppError.js")
exports.orderMaking = async (req, res) => {

    const user = req.user;
    if (!user) {
        throw new AppError("Unauthorized", 401);
    }
    const { id } = req.params;
    // check product and find the id is true
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Bad Request", 400);
    }

    const product = await productModel.findById(id);

    if (!product) {
        throw new AppError("Bad Request", 400);
    }

    const order = await orderModel.create({
        productId: product._id,
        userId: user._id,
        address: user.address,
        price: product.price,
        paymentStatus: "unpaid",
        orderStatus: "processing"
    })
    res.status(200).json({
        success: true,
        message: " order processing",
        result: order,
        orderId: order._id,
    })
}
exports.orderPayment = async (req, res) => {
    const { payMethod, orderId } = req.body;
    const allowedwaysPayment = ["cod", "netPay"];
    if (!allowedwaysPayment.includes(payMethod)) {
        throw new AppError("Invalid payment method", 400);
    }
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new AppError("Invalid Order ID", 400);
    }
    const order = await orderModel.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        payMethod: payMethod,
        orderStatus: "shipped"
    }, { new: true });

    res.status(200).json({
        success: true,
        message: "order shipped",
        result: order,
    })

}