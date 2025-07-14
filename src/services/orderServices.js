const { default: mongoose } = require("mongoose");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const AppError = require("../utils/AppError");


exports.readOrderService = async(req,res)=>{
    const user = req.user;
    if (!user) {
        throw new AppError("Unauthorized", 401);
    }
    // find orders that has been delivered ,shipped
    const filter = {
        $and: [
            { paymentStatus: "paid" },
            { orderStatus:{$in:["delivered","shipped","processing"]}}
        ]
    }
    const data =  await orderModel.find(filter).populate({path:"productId",select:"ProductName price img category description"}).limit(10);
    return data;
}
exports.orderMakingService = async (req, res) => {

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
        paymentStatus: "unpaid",
        orderStatus: "processing"
    })
    return order;
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