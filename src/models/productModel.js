const mongoose = require("mongoose");

const productSchema =  new mongoose.Schema({

    ProductName:{
        type:String,
        required:true,
        index:true,
    },
    category:{
        type:String,
        required:true,
        index:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    img:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    rating:{
        type:Number,
        required:true,
    },
},{
    timestamps:true
});

module.exports = mongoose.model("productModel",productSchema);



