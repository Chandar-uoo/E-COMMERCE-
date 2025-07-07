const productModel = require("../models/productModel");

exports.fetchProductService =  async(req,res)=>{
    const products =  await productModel.find();
    return products;
}