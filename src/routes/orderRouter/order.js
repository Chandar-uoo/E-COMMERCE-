const express = require("express");
const orderRouter = express.Router();
orderRouter.use(express.json());
const { auth } = require("../../middleware/authValidator");
const orderController = require('../../controllers/orderController.js')
const catchAsync = require("../../utils/catchAsync.js");

orderRouter.get("/read",auth,catchAsync(orderController.readOrder))
orderRouter.post("/process/:id", auth,catchAsync(orderController.orderMaking) )
orderRouter.patch("/payment/sucess", auth,catchAsync(orderController.orderPayment))
module.exports = { orderRouter, }