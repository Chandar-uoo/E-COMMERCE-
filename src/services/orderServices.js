const { default: mongoose } = require("mongoose");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const transactionModel = require("../models/transaction");
const AppError = require("../utils/AppError");
const { sendEmail } = require("../utils/email");
const { orderReceiptTemplate } = require("../utils/emailTemplates");
const { razorPayInstance } = require("../utils/razorPay");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

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
  if (totalPrice > 500000) {
    throw new AppError("Amount exceeds Razorpay order limit of ₹5,00,000",400);
  }
const amountInPaise = Math.round(totalPrice * 100);


  // inform razor pay
  const razorPayOrder = await razorPayInstance.orders.create({
    amount: amountInPaise,
    currency: "INR",
  });

  const newOrder = await orderModel.create({
    userId: user._id,
    orderId: razorPayOrder.id,
    items: validItems,
    totalPrice: totalPrice,
    address: user.address,
    paymentStatus: "unpaid",
    orderStatus: "processing",
    payMethod: "idle",
  });
  const razorPayInfo = {
    orderId: razorPayOrder.id,
    amount: razorPayOrder.amount,
    currency: razorPayOrder.currency,
    key_id: process.env.RAZORPAY_KEY_ID,
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phoneNo,
    },
  };

  await newOrder.populate({
    path: "items.productId",
    select: "title price thumbnail category description",
  });

  return { newOrder, razorPayInfo };
};

exports.orderPaymentService = async (req, res) => {
  const session = await mongoose.startSession();
  const webhookSignature = req.get("x-razorpay-signature");

  const isValidWebhookSignature = validateWebhookSignature(
    JSON.stringify(req.body),
    webhookSignature,
    process.env.RAZORPAY_WEBHOOK_SECRET
  );

  if (!isValidWebhookSignature) {
    throw new AppError("webhook signature is invalid", 400);
  }

  const paymentEntity = req.body.payload.payment.entity;
  const { status, order_id, id, amount, currency, method } = paymentEntity;

  if (status == "failed") {
    await orderModel.updateOne(
      { orderId: order_id },
      { $set: { orderStatus: "failed" } }
    );
    return status;
  }

  await session.withTransaction(async () => {
    //  order update
    const order = await orderModel.findOneAndUpdate(
      { orderId: order_id },
      { $set: { paymentStatus: "paid", payMethod: method } },
      { new: true, session } // returns the updated document
    );

    // record on transaction
    await transactionModel.create(
      [
        {
          orderId: order_id,
          paymentId: id,
          userId: order.userId,
          amount,
          currency,
          paymentMethod: method,
          status,
        },
      ],
      { session }
    );
    // product model updation

    for (const item of order.items) {
      const { productId, quantity } = item;

      const product = await productModel.findById(productId);
      const stock = product.stock - quantity;
      let soldcount = product.soldCount + quantity;
      let availabilityStatus = product.availabilityStatus;

      if (stock < 0) throw new AppError("Invalid quantity", 400);
      else if (stock === 0) availabilityStatus = "Out of Stock";
      else if (stock <= 10) availabilityStatus = "Low Stock";
      else availabilityStatus = "In Stock";

      await productModel.updateOne(
        { _id: productId },
        {
          $set: {
            stock: stock,
            availabilityStatus: availabilityStatus,
            soldcount: soldcount,
          },
        },
        { session }
      );
    }
  });

  return status;
};
