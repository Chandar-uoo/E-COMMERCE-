const express = require("express");
const adminRouter = express.Router();
adminRouter.use(express.json());
const catchAsync = require("../utils/catchAsync");
const {roleCheck} =  require("../middleware/roleValidator");
const adminController = require("../controllers/adminController");
const { auth}=  require("../middleware/authValidator")

adminRouter.get("/products",auth,roleCheck("admin"),catchAsync(adminController.fetchProduct));

module.exports = {adminRouter}