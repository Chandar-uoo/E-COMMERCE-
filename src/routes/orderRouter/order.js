const express = require("express");
const orderRouter = express.Router();
orderRouter.use(express.json());
const { auth } = require("../../middleware/authValidator");
const orderController = require('../../controllers/orderController.js')




orderRouter.post("/order/process/:id", auth,orderController.orderMaking )
orderRouter.patch("/order/payment/sucess", auth,orderController.orderPayment )
module.exports = { orderRouter, }