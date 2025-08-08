const { default: mongoose } = require("mongoose");
const productModel =  require("../models/productModel");
 const AppError = require("../utils/AppError");

exports.getProductbyFilterService = async (req, res) => {
     const {
     search,
    category,
    brand,
    tags,
    minPrice,
    maxPrice,
    stock,
    sortBy,         // "price_asc", "price_desc", "sold", "latest"
    page = 1,
    limit = 15,
  } = req.query;


    // Build filter object
    const filter = {};
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if(tags && tags.length > 0)filter.tags = {$in :tags.split(",")};
    if(stock) filter.stock = stock;

    // Regex-based partial search on title or brand
if (search) {
  const searchRegex = new RegExp(search, 'i');
  filter.$or = [
    { title: { $regex: searchRegex } },
    { brand: { $regex: searchRegex } },
    {category:{$regex:searchRegex}}
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
    const products = await productModel
      .find(filter)
      .sort(sort) // Sort by price
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();


    return products;
};

 exports.allProductService = async (req, res) => {
     const products = await productModel.find().limit(30).lean();
     return products;
 }

 exports.singleProductService =  async (req, res) => {

    const { id } = req.params;
    if ( !id || !mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid request: ID is not valid", 400);
    }
    const data = await productModel.findById(id).populate({
    path: "reviews",
    options:{sort:{createdAt:1}},
    populate: {
      path: "user",          // if you want user info inside each review
      select: "name"   // only include name and email
    }
  });
    if (!data) {
        throw new AppError("Invalid request: data not found", 404);
    }
    return data;
}

