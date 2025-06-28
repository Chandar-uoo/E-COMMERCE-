const orderModel = require("../models/orderModel.js");
const productModel = require('../models/productModel.js');
const { default: mongoose } = require("mongoose");
const AppError = require("../utils/AppError.js");
const orderServices  = require("../services/orderServices.js");

exports.orderMaking = async (req, res) => {

    const order = await orderServices.orderMakingService(req,res);

    res.status(200).json({
        success: true,
        message: " order processing",
        result: order,
        orderId: order._id,
    })
}
exports.orderPayment = async (req, res) => {
   
const order = await orderServices.orderPaymentService(req,res);
    res.status(200).json({
        success: true,
        message: "order shipped",
        result: order,
    })

}