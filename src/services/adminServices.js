const productModel = require("../models/productModel");
const userModel = require("../models/user");
const orderModel = require("../models/orderModel")
const { default: mongoose } = require("mongoose");
const AppError = require("../utils/AppError");
exports.fetchProductService = async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(Number(req.query.limt) || 10));
    const skip = (page - 1) * limit;
    const products = await productModel.find().limit(limit).skip(skip);
    const total = await productModel.countDocuments();
    return { products, total, limit, page };
}

// add product 

exports.addProductService = async (req, res) => {
    const { ProductName, category, description, price, img, stock, rating, } = req.body.product;

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
  
   const { id,updateFields  } = req.body;

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
exports.fetchUserService = async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(Number(req.query.limt) || 10));
    const skip = (page - 1) * limit;
    const users = await userModel.find({}).limit(limit).skip(skip);
    const total = await userModel.countDocuments();
    return { users, total, limit, page };
}
// fetchOrders
exports.fetchOrdersService = async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(Number(req.query.limt) || 10));
    const skip = (page - 1) * limit;
    const orders = await orderModel.find({}).limit(limit).skip(skip);
    const total = await orderModel.countDocuments();
    return { orders, total, limit, page };
}
// order to fullfill
exports.ordersToFullfillService = async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(Number(req.query.limt) || 10));
    const skip = (page - 1) * limit;
    const filter = {
        $and: [
            { paymentStatus: "paid" },
            { orderStatus: "processing" }
        ]
    }
    const orders = await orderModel.find(filter).limit(40).skip(skip);
    const total =  await orderModel.countDocuments(filter);
    return { orders, total, limit, page };
}
// update order as shipped
exports.updateOrderStatusService = async (req, res) => {
    const { id } = req.params;
    const changeOrderStatus = req.body.status;
    // checking is the payment is paid for the product
    const order = await orderModel.findById(id);
    // checking the changeOrderStatus is valid 
    const allowedStatus = ["delivered", "failure", "shipped"];
    if (!allowedStatus.includes(changeOrderStatus)) {
        throw new AppError("Invalid Status to change order", 404);
    }
    const status = order.paymentStatus === "paid" ? true : false;
    if (!status) {
        return res.status(409).json({
            success: false,
            message: "payment has not been done for the product"
        })
    }
    order.orderStatus = changeOrderStatus;
    await order.save();
    return order;

}