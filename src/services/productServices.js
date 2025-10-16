const { default: mongoose } = require("mongoose");
const productModel = require("../models/productModel");
const AppError = require("../utils/AppError");
const reviewModel = require("../models/reviewModel");
exports.getProductbyFilterService = async (req, res) => {
  const {
    search,
    category,
    brand,
    tags,
    minPrice,
    maxPrice,
    stock,
    sortBy, // "price_asc", "price_desc", "sold", "latest"
  } = req.query;

  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(Number(req.query.limt) || 20));
  const skip = (page - 1) * limit;
  // Build filter object
  const filter = {};
  filter.isDeleted = false;
  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (tags && tags.length > 0) filter.tags = { $in: tags.split(",") };
  const  allowedStocks =  ["In Stock", "Out of Stock", "Low Stock", "Discontinued"];
  if( stock && !allowedStocks.includes(stock)) {
    throw new AppError("Bad Request", 400);
  }
  if (stock) filter.availabilityStatus = stock;
  

  // Regex-based partial search on title or brand
  if (search) {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [
      { title: { $regex: searchRegex } },
      { brand: { $regex: searchRegex } },
      { category: { $regex: searchRegex } },
    ];
  }
  // range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  // Sorting Logic
  let sort = {};
  switch (sortBy) {
    case "price_asc":
      sort.price = 1;
      break;
    case "price_desc":
      sort.price = -1;
      break;
    case "sold":
      sort.soldCount = -1;
      break;
    case "latest":
      sort.createdAt = -1;
      break;
    default:
      sort.createdAt = -1;
  }
  const [products, total] = await Promise.all([
    productModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    productModel.countDocuments(filter),
  ]);

  return { products, total, limit, page };
};

exports.allProductService = async (req, res) => {
  const products = await productModel.find({isDeleted:false}).limit(30).lean();
  return products;
};

exports.singleProductService = async (req, res) => {
  const { id } = req.params;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid request: ID is not valid", 400);
  }
  const data = await productModel.findById(id).populate({
    path: "reviews",
    options: { sort: { createdAt: 1 } },
    populate: {
      path: "user", // if you want user info inside each review
      select: "name", 
    },
  });
  if (!data) {
    throw new AppError("Invalid request: data not found", 404);
  }
  return data;
};

exports.createReviewService = async (req, res) => {
  const { comment, rating } = req.body;
  const { id } = req.params;

  const user = req.user;
  if (!comment || !rating || !id || !user) {
    throw new AppError("BAD_REQUEST", 400);
  }
  // validate string  & rating
  if (typeof comment !== "string" || comment.trim().length < 1) {
    throw new AppError("Invalid comment", 400);
  }

  if (typeof rating !== "number" || rating < 1 || rating > 5) {
    throw new AppError("Invalid rating", 400);
  }

  const isProduct = await productModel.exists({ _id: id });
  if (!isProduct) {
    throw new AppError("NO PRODUCT FOUND", 404);
  }
  // checking user already review this product
  const isExisting = await reviewModel.findOne({
    user: user._id,
    product: id,
  });
  if (isExisting) {
    throw new AppError("Already user review this product", 400);
  }
  const newReview = await reviewModel.create({
    user: user._id,
    product: id,
    comment,
    rating,
  });
  return ;
};
