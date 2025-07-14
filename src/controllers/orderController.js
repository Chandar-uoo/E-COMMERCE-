
const orderServices  = require("../services/orderServices.js");

exports.readOrder =  async(req,res)=>{
    const order =  await orderServices.readOrderService(req,res);
    res.status(200).json({
        success: true,
        message: " order processing",
        result: order,
    })
}
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