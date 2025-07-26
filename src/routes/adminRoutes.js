const express = require("express");
const adminRouter = express.Router();
adminRouter.use(express.json());
const catchAsync = require("../utils/catchAsync");
const {roleCheck} =  require("../middleware/roleValidator");
const adminController = require("../controllers/adminController");

const {auth}=  require("../middleware/authValidator")

// get all profucts
adminRouter.get("/products",auth,roleCheck("admin"),catchAsync(adminController.fetchProduct));

// add products
adminRouter.post("/add-product",auth,roleCheck("admin"),catchAsync(adminController.addProduct));
// edit products
adminRouter.patch("/update-product",auth,roleCheck("admin"),catchAsync(adminController.updateProduct))
// delete product 
adminRouter.delete("/delete-product/:id",auth,roleCheck("admin"),catchAsync(adminController.deleteProduct));
// fetch order
adminRouter.get("/orders",auth,roleCheck("admin"),catchAsync(adminController.fetchOrder));
// fetch user
adminRouter.get("/user",auth,roleCheck("admin"),catchAsync(adminController.fetchUser));
//fetch order = paid & paymentStatus processing
adminRouter.get("/orders-to-fullfill",auth,roleCheck("admin"),catchAsync(adminController.filterOrdersStatus));

module.exports = {adminRouter}; 