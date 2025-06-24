const express = require("express");
const productRouter = express.Router();
const {auth} = require("../../middleware/authValidator")
productRouter.use(express.json());

const productController = require("../../controllers/productController")
// search
productRouter.get('/search-product',auth,productController.searchProduct);
// all products
productRouter.get("/", auth,productController.allProducts);
// single product
productRouter.get("/:id",auth,productController.singleProduct );

module.exports = {
    productRouter,
}