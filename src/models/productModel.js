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
// index 
productSchema.index({category:1},{ProductName:1});
module.exports = mongoose.model("productModel",productSchema);
