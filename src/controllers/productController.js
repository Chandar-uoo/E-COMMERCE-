const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");

exports.searchProduct = async (req,res) => {
    try {
        const query = req.query.q;
        const products =  await productModel.find({
           $or:[
           { ProductName:{$regex:query,$options:'i'}},
           {category:{$regex:query,$options:'i'}}
           ]
        });
        res.status(200).json({
            message:'successfull',
            result:products
        })
    } catch (err) {
        return res.status(500).json({
            message:"something went wrong",
            result:err.message
        })
    }    
}
exports.allProducts = async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json({
            message:"suceess",
            result:products
        });
    } catch (error) {
        console.log("error")
        res.status(500).json({
            message: "failed"
        })
    }
}
exports.singleProduct = async (req, res) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                message: "invalid request"
            });
        }

        const data = await productModel.findById(id);

        if (!data) {
            res.status(400).json({
                message: "invalid request"
            });
        }
        res.status(200).json({
            message: "sucess",
            result: data
        })
    } catch (err) {
        console.log(err);
        res.send(err).status(500)
    }
}