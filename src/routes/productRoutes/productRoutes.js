const express = require("express");
const productRouter = express.Router();
const {auth} = require("../../middleware/authValidator");
const catchAsync = require('../../utils/catchAsync')
productRouter.use(express.json());

const productController = require("../../controllers/productController")
// search
productRouter.get('/search-product',auth,catchAsync(productController.searchProduct));
// all products
productRouter.get("/", auth,catchAsync(productController.allProducts));
// single product
productRouter.get("/:id",auth,catchAsync(productController.singleProduct) );

module.exports = {
    productRouter,
}