const { default: mongoose } = require("mongoose");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const transactionModel = require("../models/transaction");
const AppError = require("../utils/AppError");
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

  // Extract productIds
  const productIds = itemsFromClient.map((item) => item.productId);

  // validate product ids
  const allValidIds = productIds.every((id) =>
    mongoose.Types.ObjectId.isValid(id)
  );
  if (!allValidIds) {
    throw new AppError("Invalid product ID", 400);
  }

  // ✅ Fetch all products
  const products = await productModel.find({ _id: { $in: productIds } });
  if (products.length != productIds.length) {
    const foundProductIds = products.map((product) => product._id);
    const missingIds = productIds.filter((id) => !foundProductIds.includes(id));
    if (missingIds) {
      throw new AppError(`Products not found: ${missingIds.join(" , ")}`, 404);
    }
  }

  // ✅ Prepare validated items + total
  const validItems = [];
  let calculatedTotal = 0;
  for (const item of itemsFromClient) {
    const { productId, quantity } = item;
    const currProduct = products.find((p) => p._id.toString() === productId);
    if (
      !quantity ||
      typeof quantity !== "number" ||
      quantity <= 0 ||
      quantity > currProduct.stock
    ) {
      throw new AppError(`Invalid quantity for ${currProduct.title}`, 400);
    }

    // Calculate total price on server side
    calculatedTotal += parseFloat(currProduct.price) * quantity;

    validItems.push({
      productId: currProduct._id,
      quantity: quantity,
    });
  }

  // Round to 2 decimal places
  const totalPrice = Math.round(calculatedTotal * 100) / 100;

  // razory pay max amt validation
  if (totalPrice > 500000) {
    throw new AppError("Amount exceeds Razorpay order limit of ₹5,00,000", 400);
  }

  // create rzpy instance
  const amountInPaise = Math.round(totalPrice * 100);
  const razorPayOrder = await razorPayInstance.orders.create({
    amount: amountInPaise,
    currency: "INR",
  });

  // create order
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

  // extracting info for front end
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

  //  Populate & Prepare Response
  await newOrder.populate({
    path: "items.productId",
    select: "title price thumbnail category description",
  });

  return { newOrder, razorPayInfo };
};

exports.orderPaymentService = async (req, res) => {
  const session = await mongoose.startSession();
  const webhookSignature = req.get("x-razorpay-signature");

  //validate sign
  const isValidWebhookSignature = validateWebhookSignature(
    JSON.stringify(req.body),
    webhookSignature,
    process.env.RAZORPAY_WEBHOOK_SECRET
  );
  if (!isValidWebhookSignature) {
    throw new AppError("webhook signature is invalid", 400);
  }

  // extracting input
  const paymentEntity = req.body.payload.payment.entity;
  const { status, order_id, id, amount, currency, method } = paymentEntity;

  // for cancelled payment
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

    // extract id
    const productIds = order.items.map((item) => item.productId);
    console.log(productIds);

    // fetch products
    const products = await productModel.find({ _id: { $in: productIds } });
    console.log(products);

    // update latest info
    for (const item of order.items) {
      const { productId, quantity } = item;
      const product = products.find((p) => p._id.equals(productId));
      if (!product) throw new AppError(`Product not found: ${productId} `, 404);
      const updatedStock = product.stock - quantity;
      let updatedSoldCount = product.soldCount + quantity;
      let updatedAvailabilityStatus = product.availabilityStatus;

      if (updatedStock < 0) throw new AppError("Invalid quantity", 400);
      else if (updatedStock === 0) updatedAvailabilityStatus = "Out of Stock";
      else if (updatedStock <= 10) updatedAvailabilityStatus = "Low Stock";
      else updatedAvailabilityStatus = "In Stock";
      await productModel.updateOne(
        { _id: productId },
        {
          $set: {
            stock: updatedStock,
            availabilityStatus: updatedAvailabilityStatus,
            soldCount: updatedSoldCount,
          },
        },
        { session }
      );
    }
  });
  console.log("done good");

  return status;
};
