const { default: mongoose } = require("mongoose");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const AppError = require("../utils/AppError");


exports.readOrderService = async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError("Unauthorized", 401);
    }
    // find orders that has been delivered ,shipped
    const filter = {
        $and: [
            { paymentStatus: "paid" },
            { orderStatus: { $in: ["delivered", "shipped", "processing"] } }
        ]
    }
    const data = await orderModel.find(filter).populate({ path: "productId", select: "ProductName price img category description" }).limit(10);
    return data;
}
exports.orderMakingService = async (req, res) => {

    const user = req.user;
    if (!user) {
        throw new AppError("Unauthorized", 401);
    }
    const { itemsFromClient } = req.body;
    if (itemsFromClient && itemsFromClient.length === 0) {
        throw new AppError("No items provided", 400);
    }
    const validItems = [];

    for (const item of itemsFromClient) {
        const { productId, quantity } = item;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new AppError("Invalid product ID", 400);
        }

        const product = await productModel.findById(productId);
        if (!product) {
            throw new AppError(`Product not found: ${productId}`, 404);
        }

        if (quantity !== undefined && typeof quantity !== "number") {
            throw new AppError("Invalid quantity type", 400);
        }

        validItems.push({
            productId: product._id,
            quantity: quantity || 1,
        });
    }
    const newOrder = await orderModel.create({
        userId: user._id,
        items: validItems,
        address: user.address,
        paymentStatus: "unpaid",
        orderStatus: "processing",
        payMethod: "idle",
    })
    return newOrder;
}

exports.orderPaymentService = async (req, res) => {
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
    }, { new: true });

    return order;
}
