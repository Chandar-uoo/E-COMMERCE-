const { default: mongoose } = require("mongoose");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const AppError = require("../utils/AppError");
const { sendEmail } = require("../utils/email");

exports.readOrderService = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }
  // find orders that has been delivered ,shipped
  const filter = {
    $and: [
      { userId: user._id },
      { paymentStatus: "paid" },
      { orderStatus: { $in: ["delivered", "shipped", "processing"] } },
    ],
  };
  const data = await orderModel
    .find(filter)
    .populate({
      path: "items.productId",
      select: "title price thumbnail category description",
    })
    .sort({ createdAt: -1 })
    .lean();
  return data;
};
exports.orderMakingService = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  const { itemsFromClient } = req.body;

  if (!itemsFromClient || itemsFromClient.length === 0) {
    throw new AppError("No items provided", 400);
  }

  const validItems = [];
  let calculatedTotal = 0;

  for (const item of itemsFromClient) {
    const { productId, quantity } = item;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError("Invalid product ID", 400);
    }

    const product = await productModel.findById(productId);
    if (!product) {
      throw new AppError(`Product not found: ${productId}`, 404);
    }

    if (
      quantity === undefined ||
      typeof quantity !== "number" ||
      quantity <= 0 ||
      quantity > product.stock
    ) {
      throw new AppError("Invalid quantity", 400);
    }

    // Calculate total price on server side
    calculatedTotal += parseFloat(product.price) * quantity;

    validItems.push({
      productId: product._id,
      quantity: quantity,
    });
  }

  // Round to 2 decimal places
  const totalPrice = Math.round(calculatedTotal * 100) / 100;

  const newOrder = await orderModel.create({
    userId: user._id,
    items: validItems,
    totalPrice: totalPrice,
    address: user.address,
    paymentStatus: "unpaid",
    orderStatus: "processing",
    payMethod: "idle",
  });

  await newOrder.populate({
    path: "items.productId",
    select: "title price thumbnail category description",
  });

  return newOrder;
};

exports.orderPaymentService = async (req, res) => {
  const user = req.user;
  const { payMethod, orderId } = req.body;

  const allowedwaysPayment = ["cod", "netPay"];
  if (!payMethod || !allowedwaysPayment.includes(payMethod)) {
    throw new AppError("Invalid payment method", 400); // Fixed
  }

  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError("Invalid Order ID", 400);
  }

  const order = await orderModel.findByIdAndUpdate(
    orderId,
    {
      paymentStatus: "paid",
      payMethod: payMethod,
    },
    { new: true }
  );

  if (!order) {
    throw new AppError("Order not found", 404);
  }
  const subject = `Your payment was successful – Order Receipt ${orderId}`;

  const text = `
Hello ${user.name},

Thank you for shopping with us!

We have received your payment successfully. Here are the details of your order:

Order ID: ${orderId}
Payment Method: ${payMethod}
Payment Status: ${order.paymentStatus}
Order Status: ${order.orderStatus}
Shipping Address: ${order.address}

Items Ordered:
${order.items
  .map((i) => `- ${i.name} (x${i.quantity}) – $${i.price}`)
  .join("\n")}

Total Paid: $${order.totalPrice}

You can expect another update once your order is shipped.

If you have any questions, reply to this email and we’ll be happy to help.

Best regards,  
The RetailX E-Commerce Team
`;
  await sendEmail({ to: user.email, subject, text });
  return order;
};
