const productServices = require("../services/productServices");

exports.searchProduct = async (req, res) => {
  const{ products,total,limit,page} = await productServices.getProductbyFilterService(req, res);

  res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    result: {
      data: products,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    },
  });
};
exports.allProducts = async (req, res) => {
  const products = await productServices.allProductService(req, res);
  res.status(200).json({
    sucess: true,
    message: "suceess",
    result: products,
  });
};
exports.singleProduct = async (req, res) => {
  const data = await productServices.singleProductService(req, res);
  res.status(200).json({
    success: true,
    message: "sucess",
    result: data,
  });
};
exports.createtProductReview =   async (req,res) => {
     await productServices.createReviewService(req,res);
    
     res.status(201).json({
        success: true,
        message: ' review created successfully',
    })
    
}
