const productModel = require("../models/productModel");
const express = require("express");
const { default: mongoose } = require("mongoose");
const productRouter = express.Router();

productRouter.use(express.json());

productRouter.get("/product", async (req, res) => {
    try {
        const products = await productModel.find();
        res.status(200).json({
            message:"suceess",
            result:products
        });
    } catch (error) {
        console.log("error")
        res.status(404).json({
            message: "failed"
        })
    }
});
productRouter.get("/product/:id", async (req, res) => {
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
});
module.exports = {
    productRouter,
}