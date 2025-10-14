
const orderServices  = require("../services/orderServices.js");

exports.readOrder =  async(req,res)=>{
    const order =  await orderServices.readOrderService(req,res);
    res.status(200).json({
        success: true,
        message: "order fetched",
        result: order,
    })
}
exports.orderMaking = async (req, res) => {

    const {newOrder,razorPayInfo} = await orderServices.orderMakingService(req,res);

    res.status(200).json({
        success: true,
        message:"order created",
        result: {
            order:newOrder,
            razorPay:razorPayInfo
        },
    })
}
exports.orderPayment = async (req, res) => {
   
const orderStatus = await orderServices.orderPaymentService(req,res);
    res.status(200).json({
        success: true,
        message: `order has been ${orderStatus}`,
    })

}