const productModel = require("../models/productModel");
const userModel = require("../models/user");
const orderModel = require("../models/orderModel")
const { default: mongoose } = require("mongoose");
const AppError = require("../utils/AppError");
exports.fetchProductService = async (req, res) => {
    const products = await productModel.find();
    return products;
}

// add product 

exports.addProductService = async (req, res) => {
    const { ProductName, category, description, price, img, stock, rating, } = req.body;

    if (!ProductName || !category || !description || !price || !img || !stock || !rating) {
        return res.status(400).json({
            sucsess: false,
            message: "please enter all details",
        })
    }

    const existingProduct = await productModel.findOne({ ProductName });
    if (existingProduct) {
        throw new AppError("product is already available", 401)
    }

    const newProduct = await productModel.create({
        ProductName,
        category,
        description,
        price,
        img,
        stock,
        rating
    });

    return newProduct;
}
// update product
exports.updateProductService = async (req, res) => {
    const { id } = req.params;
    const updateFields = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Bad Request", 400);
    }
    const product = await productModel.findById(id);
    if (!product) {
        throw new AppError("product not found", 404);
    }

    const allowedFields = ["ProductName", "category", "description", "price", "img", "stock", "rating"];
    const updates = {};
    for (let key in updateFields) {
        if (allowedFields.includes(key)) {
            updates[key] = updateFields[key];
        }
    }

    const updateProduct = await productModel.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
    });

    return updateProduct;
};
// delete product
exports.deleteProductSevice = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Bad Request", 400);
    }

    const product = await productModel.findById(id);
    if (!product) {
        throw new AppError("product not found", 404);
    }

    const deleteProduct = await productModel.findByIdAndDelete(id);
    return deleteProduct;
}
// fetch user
exports.fetchUserService =  async(req,res)=>{
 const users = await userModel.find({});
 return users;
}
// fetchOrders
exports.fetchOrdersService =  async(req,res)=>{
    const orders =  await orderModel.find({});
    return orders;
}