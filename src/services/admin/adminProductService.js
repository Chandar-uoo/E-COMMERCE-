const normalizeProductData = require("../../utils/normaliseProductData");
const AppError = require("../../utils/AppError");
const productModel = require("../../models/productModel");
const { default: mongoose } = require("mongoose");

/* fetch product */
exports.fetchProductService = async (req, res) => {
  const { fetch, availabilityStatus } = req.query;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(Number(req.query.limit) || 16));
  const skip = (page - 1) * limit;
  const filter = {};

  if (fetch && fetch.trim().length > 0) {
    filter.$or = [
      { ProductName: { $regex: fetch.trim(), $options: "i" } },
      { category: { $regex: fetch.trim(), $options: "i" } },
    ];
  }

  if (availabilityStatus && availabilityStatus.trim().length > 0) {
    const allowedAvailabilityStatus = [
      "In Stock",
      "Out of Stock",
      "Low Stock",
      "Discontinued",
    ];

    const trimmedStatus = availabilityStatus.trim();

    if (!allowedAvailabilityStatus.includes(trimmedStatus)) {
      throw new AppError("Invalid availability status", 400);
    }

    filter.availabilityStatus = trimmedStatus;
  }

  const [products, total] = await Promise.all([
    productModel.find(filter).limit(limit).skip(skip).lean(),
    productModel.countDocuments(filter),
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

   await productModel.create(productData);
  return ;
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

   await productModel.findByIdAndUpdate(
    id,
    normalizedUpdates,
    {
      new: true,
      runValidators: true,
    }
  );

  return ;
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

   await productModel.findByIdAndUpdate(id, {
    isDeleted: true,
    availabilityStatus: "Discontinued",
  });
  return;
};
