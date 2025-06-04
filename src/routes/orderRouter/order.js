const express = require("express");
const orderRouter = express.Router();
orderRouter.use(express.json());
const orderModel = require("../../models/orderModel.js");
const { auth } = require("../../middleware/authValidator");
const { default: mongoose } = require("mongoose");
const productModel = require("../../models/productModel.js");



orderRouter.post("/order/process/:id", auth, async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        // check product and find the id is true
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "product not available"
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
            data: order,
            orderId: order._id,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })

    }
})
orderRouter.patch("/order/payment/sucess", auth, async (req, res) => {
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
        });
        await order.save();
        res.status(200).json({
            message: "order shipped",
            data: order,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "something went wrong"
        })
    }

})
module.exports = { orderRouter, }