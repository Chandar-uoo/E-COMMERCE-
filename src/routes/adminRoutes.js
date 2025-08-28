const express = require("express");
const adminRouter = express.Router();
adminRouter.use(express.json());
const catchAsync = require("../utils/catchAsync");
const {roleCheck} =  require("../middleware/roleValidator");
const adminController = require("../controllers/adminController");
const { validateProductInput} =  require("../middleware/productValidator")
const {auth}=  require("../middleware/authValidator")

// get all profucts
adminRouter.get("/products",auth,roleCheck("admin"),catchAsync(adminController.fetchProduct));

// add products
adminRouter.post("/add-product",auth,roleCheck("admin"),validateProductInput,catchAsync(adminController.addProduct));
// filter product
adminRouter.get("/filter",auth,roleCheck("admin"),catchAsync(adminController.filterProduct))
// edit products
adminRouter.patch("/update-product",auth,roleCheck("admin"),validateProductInput,catchAsync(adminController.updateProduct))
// delete product 
adminRouter.delete("/delete-product/:id",auth,roleCheck("admin"),catchAsync(adminController.deleteProduct));
// fetch order
adminRouter.get("/orders",auth,roleCheck("admin"),catchAsync(adminController.fetchOrder));
// fetch user
adminRouter.get("/user",auth,roleCheck("admin"),catchAsync(adminController.fetchUser));
//fetch order = paid & paymentStatus processing
adminRouter.patch("/update-Order-Status/:id",auth,catchAsync(adminController.updateOrderStatus));


module.exports = {adminRouter}; 