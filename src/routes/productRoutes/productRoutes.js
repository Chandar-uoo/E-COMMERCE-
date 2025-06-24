const express = require("express");
const productRouter = express.Router();
const {auth} = require("../../middleware/authValidator")
productRouter.use(express.json());

const productController = require("../../controllers/productController")
// search
productRouter.get('/product/search',auth,productController.searchProduct);
// all products
productRouter.get("/product", auth,productController.allProducts);
// single product
productRouter.get("/product/:id",auth,productController.singleProduct );

module.exports = {
    productRouter,
}