const express = require("express");
const adminRouter = express.Router();
adminRouter.use(express.json());
const catchAsync = require("../utils/catchAsync");
const {roleCheck} =  require("../middleware/roleValidator");
const adminProductController =  require("../controllers/admin/adminProductController.js")
const adminOrderController =  require("../controllers/admin/adminOrderController");
const adminCustomerController = require("../controllers/admin/adminCustomerController")
const { validateProductInput} =  require("../middleware/productValidator")
const {auth}=  require("../middleware/authValidator")
const adminDashBoardController = require("../controllers/admin/adminDashBoardController")
//fetch admin dashBoard 
adminRouter.get("/admin-dash-board",auth,roleCheck("admin"),catchAsync(adminDashBoardController.fetchAdminDashboardData))
//products
// get all profucts
adminRouter.get("/product",auth,roleCheck("admin"),catchAsync(adminProductController.fetchProduct));
// add products
adminRouter.post("/product/add-product",auth,roleCheck("admin"),validateProductInput,catchAsync(adminProductController.addProduct));
// edit products
adminRouter.patch("/product/update-product",auth,roleCheck("admin"),validateProductInput,catchAsync(adminProductController.updateProduct))
// delete product 
adminRouter.delete("/product/delete-product/:id",auth,roleCheck("admin"),catchAsync(adminProductController.deleteProduct));
//order
// fetch order
adminRouter.get("/order",auth,roleCheck("admin"),catchAsync(adminOrderController.fetchOrder));
// fetch user
adminRouter.get("/user",auth,roleCheck("admin"),catchAsync(adminCustomerController.fetchUser));
//fetch order = paid & paymentStatus processing
adminRouter.patch("/order/update-order-status/:id",auth,catchAsync(adminOrderController.updateOrderStatus));


module.exports = {adminRouter}; 