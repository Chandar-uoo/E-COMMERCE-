const orderModel = require("../models/orderModel.js");
const productModel = require('../models/productModel.js');
const { default: mongoose } = require("mongoose");

exports.orderMaking = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        // check product and find the id is true
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "product id  not vaildable"
            })
        };
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(400).json({
                message: "product not available"
            })
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
            message: " order processing",
            result: order,
            orderId: order._id,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })

    }
}
exports.orderPayment = async (req, res) => {
    try {
        const { payMethod, orderId } = req.body;
        const allowedwaysPayment = ["cod", "netPay"];
        if (!allowedwaysPayment.includes(payMethod)) {
            return res.status(400).json({
                message: "product payment method not valid"
            })
        }
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({
                message: "product not available"
            })
        }
        const order = await orderModel.findByIdAndUpdate(orderId,{
            paymentStatus:"paid",
            payMethod:payMethod,
            orderStatus:"shipped"
        },{new:true});
        
        res.status(200).json({
            message: "order shipped",
            result: order,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })
    }

}