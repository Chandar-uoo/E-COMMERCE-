

const cartServices = require("../services/cartServices");

exports.addToCart = async (req, res) => {
    const data = await cartServices.addToCartService(req, res);
    res.status(201).json({
        success: true,
        message: "successfully item added to cart",
        result: data
    });

}
exports.readCart = async (req, res) => {

    const data = await cartServices.readCartService(req, res);

    res.status(200).json({
        success: true,
        message: "success of fetching data",
        result: data
    })

}
exports.updateCart = async (req, res) => {

    const data = await cartServices.updateCartService(req, res);

    res.status(200).json({
        success: true,
        message: "sucessful",
        data: data,
    })

}
exports.deleteCart = async (req, res) => {
     await cartServices.deleteCartServices(req, res);

    res.status(204).json({
        sucess: true,
        message: "sucessfully product removedd",
    })
}
exports.clearCart = async (req, res) => {
     await cartServices.clearCartService(req, res);
    res.status(204).json({
        success: true,
        message: "cart cleared",
    })
}