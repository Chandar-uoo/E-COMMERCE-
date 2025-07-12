const { default: mongoose } = require("mongoose");
const productModel =  require("../models/productModel");
 const AppError = require("../utils/AppError");

 exports.searchService =  async (req, res) => {
    const page = Math.max(1,Number(req.query.page) || 1);
    const limit = Math.min(100,Math.max(Number(req.query.limt) || 10));
    const skip = (page - 1 ) * limit;
     const query = req.query.q;
     const filterQuery = {
        $or: [
            { ProductName: { $regex: query, $options: 'i' } },
            { category: { $regex: query, $options: 'i' } }
        ]
    }
     const products = await productModel.find(filterQuery).limit(limit).skip(skip);
     const total = await productModel.countDocuments(filterQuery);
    return { products, total, limit, page };
 }

 exports.allProductService = async (req, res) => {
     const products = await productModel.find().limit(30);
     return products;
 }

 exports.singleProductService =  async (req, res) => {

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid request: ID is not valid", 400);
    }
    const data = await productModel.findById(id);
    if (!data) {
        throw new AppError("Invalid request: data not found", 400);
    }
    return data;
}

