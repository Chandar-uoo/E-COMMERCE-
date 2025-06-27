const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
 const AppError = require("../utils/AppError")
exports.searchProduct = async (req, res) => {
    const query = req.query.q;
    const products = await productModel.find({
        $or: [
            { ProductName: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
        ]
    });
    res.status(200).json({
        success: true,
        message: 'successfull',
        result: products
    })
}
exports.allProducts = async (req, res) => {

    const products = await productModel.find();
    res.status(200).json({
        sucess: true,
        message: "suceess",
        result: products
    });
}
exports.singleProduct = async (req, res) => {

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid request: ID is not valid", 400);
    }

    const data = await productModel.findById(id);

    if (!data) {
        throw new AppError("Invalid request: data not found", 400);
    }
    res.status(200).json({
        success: true,
        message: "sucess",
        result: data
    })
}