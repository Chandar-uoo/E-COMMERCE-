const orderModel = require("../../models/orderModel");
const { default: mongoose } = require("mongoose");
const AppError = require("../../utils/AppError");

/*order */

// fetchOrders
exports.fetchOrdersService = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(Number(req.query.limit) || 16));
  const skip = (page - 1) * limit;
  const { orderStatus } = req.query;
  if (!orderStatus) {
    throw new AppError("Bad request", 400);
  }
  const filter = {};

  const allowedOrderStatus = [
    "cancelled",
    "processing",
    "delivered",
    "shipped",
    "all",
    "failed",
  ];

  if (!allowedOrderStatus.includes(orderStatus)) {
    throw new AppError("invalid request", 400);
  }

  if (orderStatus !== "all") {
    filter.orderStatus = orderStatus;
  }
  const [orders, total] = await Promise.all([
    orderModel
      .find(filter)
      .populate({
        path: "items.productId",
        select: "title price thumbnail category description",
      })
      .populate({
        path: "userId",
        select: "name",
      })
      .limit(limit)
      .skip(skip)
      .lean(),

    orderModel.find(filter).countDocuments(),
  ]);

  return { orders, total, limit, page };
};
// update order as shipped
exports.updateOrderStatusService = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Bad Request", 400);
  }
  // checking is the payment is paid for the product
  const order = await orderModel.findById(id);

  if (!order) {
    throw new AppError(
      "Request order updation is not available on system",
      404
    );
  }

  if (order.paymentStatus !== "paid") {
    throw new AppError("Payment has not been done for this product", 409);
  }

  order.orderStatus = "shipped";
  await order.save();
  return order;
};
