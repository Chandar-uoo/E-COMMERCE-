const productModel = require("../models/productModel");
const userModel = require("../models/user");
const orderModel = require("../models/orderModel");
const { default: mongoose } = require("mongoose");
const AppError = require("../utils/AppError");
const normalizeProductData = require("../utils/normaliseProductData");

/*product */

/* fetch product */
exports.fetchProductService = async (req, res) => {
  const { fetch } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(Number(req.query.limit) || 16));
  const skip = (page - 1) * limit;

  if (!fetch || fetch.trim().length === 0) {
    const [products, total] = await Promise.all([
       productModel.find({}).limit(limit).skip(skip),
       productModel.countDocuments(),
    ]);
    return { products, total, limit, page };
  }

  const filterQuery = {
    $or: [
      { ProductName: { $regex: fetch, $options: "i" } },
      { category: { $regex: fetch, $options: "i" } },
    ],
  };
  const [products, total] =  await Promise.all([
     productModel.find(filterQuery).limit(limit).skip(skip).lean(),
     productModel.countDocuments(filterQuery),
  ]);
  return { products, total, limit, page };
};
// filter product
exports.filterProductSevice = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(Number(req.query.limit) || 16));
  const skip = (page - 1) * limit;
  const { availabilityStatus } = req.query;
  if (!availabilityStatus) {
    throw new AppError("Bad request", 400);
  }
  const filter = {};
  const allowedAvailabiltyStatus = [
    "In Stock",
    "Out of Stock",
    "Low Stock",
    "Discontinued",
  ];

  if (!allowedAvailabiltyStatus.includes(availabilityStatus)) {
    throw new AppError("invalid request", 400);
  }

  filter.availabilityStatus = availabilityStatus;

  const [products, total] =  await Promise.all([
     productModel.find(filter).limit(limit).skip(skip).lean(),

     productModel.find(filter).countDocuments(),
  ]);

  return { products, total, limit, page };
};
// Add product
exports.addProductService = async (req, res) => {
  const productData = normalizeProductData(req.body.updateFields);

  const existingProduct = await productModel.findOne({
    title: productData.title,
  });
  if (existingProduct) {
    throw new AppError("Product is already available", 409);
  }

  const newProduct = await productModel.create(productData);
  return newProduct;
};

// Update product
exports.updateProductService = async (req, res) => {
  const { id, updateFields } = req.body;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Bad Request", 400);
  }

  const product = await productModel.findById(id);
  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const normalizedUpdates = normalizeProductData(updateFields);

  const updatedProduct = await productModel.findByIdAndUpdate(
    id,
    normalizedUpdates,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedProduct;
};

// delete product
exports.deleteProductSevice = async (req, res) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Bad Request", 400);
  }

  const product = await productModel.findById(id);
  if (!product) {
    throw new AppError("product not found", 404);
  }

  const deleteProduct = await productModel.findByIdAndUpdate(id, {
    isDeleted: true,
    availabilityStatus:"Discontinued"

  });
  return deleteProduct;
};
/* user */
// fetch user
exports.fetchUserService = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(Number(req.query.limit) || 16));
  const skip = (page - 1) * limit;
  const { fetchUser } = req.query;

  if (!fetchUser || fetchUser.trim().length !== 0) {
    const filterQuery = {
      name: { $regex: fetchUser, $options: "i" },
    };
    const [users, total] = await Promise.all([
       userModel
        .find(filterQuery)
        .select("name email DOB address phoneNo image")
        .limit(limit)
        .skip(skip),
       userModel.find(filterQuery).countDocuments(),
    ]);
    return { users, total, limit, page };
  }

  const [users, total] = await Promise.all([
     userModel
      .find({})
      .select("name email DOB address phoneNo image")
      .limit(limit)
      .skip(skip)
      .lean(),
     userModel.find({}).countDocuments(),
  ]);
  return { users, total, limit, page };
};

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
    throw new AppError("Payment has not been completed for this product", 409);
  }

  order.orderStatus = "shipped";
  await order.save();
  return order;
};
