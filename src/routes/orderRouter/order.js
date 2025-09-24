const express = require("express");
const orderRouter = express.Router();
orderRouter.use(express.json());
const { auth } = require("../../middleware/authValidator");
const orderController = require('../../controllers/orderController.js')
const catchAsync = require("../../utils/catchAsync.js");

orderRouter.get("/read",auth,catchAsync(orderController.readOrder))
orderRouter.post("/process", auth,catchAsync(orderController.orderMaking) )
orderRouter.patch("/payment/webhook",catchAsync(orderController.orderPayment))
module.exports = { orderRouter, }