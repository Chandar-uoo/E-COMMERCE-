const mongoose = require("mongoose");

const productSchema =  new mongoose.Schema({
    ProductName:String,
    category:String,
    description:String,
    price:Number,
    img:String,
    stock:Number,
    rating:Number
},{
    timestamps:true
});
module.exports = mongoose.model("productModel",productSchema);
