const express = require("express");
const adminRouter = express.Router();
adminRouter.use(express.json());
const catchAsync = require("../utils/catchAsync");
const {roleCheck} =  require("../middleware/roleValidator");
const adminController = require("../controllers/adminController");
const { validateProductInput} =  require("../middleware/productValidator")
const {auth}=  require("../middleware/authValidator")
const adminDashBoardController = require("../controllers/admin/adminDashBoardController")
//fetch admin dashBoard 
adminRouter.get("/admin-dash-board",auth,roleCheck("admin"),catchAsync(adminDashBoardController.fetchAdminDashboardData))
// get all profucts
adminRouter.get("/product",auth,roleCheck("admin"),catchAsync(adminController.fetchProduct));
// add products
adminRouter.post("/product/add-product",auth,roleCheck("admin"),validateProductInput,catchAsync(adminController.addProduct));
// filter product
adminRouter.get("/product/filter",auth,roleCheck("admin"),catchAsync(adminController.filterProduct))
// edit products
adminRouter.patch("/product/update-product",auth,roleCheck("admin"),validateProductInput,catchAsync(adminController.updateProduct))
// delete product 
adminRouter.delete("/product/delete-product/:id",auth,roleCheck("admin"),catchAsync(adminController.deleteProduct));
// fetch order
adminRouter.get("/order",auth,roleCheck("admin"),catchAsync(adminController.fetchOrder));
// fetch user
adminRouter.get("/user",auth,roleCheck("admin"),catchAsync(adminController.fetchUser));
//fetch order = paid & paymentStatus processing
adminRouter.patch("/order/update-order-status/:id",auth,catchAsync(adminController.updateOrderStatus));


module.exports = {adminRouter}; 