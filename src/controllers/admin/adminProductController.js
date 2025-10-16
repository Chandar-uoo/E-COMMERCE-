const adminProductService = require("../../services/admin/adminProductService");

exports.fetchProduct = async (req, res) => {
  const { products, total, limit, page } =
    await adminProductService.fetchProductService(req, res);
  res.status(200).json({
    success: true,
    message: "admin fetched all products",
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

exports.addProduct = async (req, res) => {
  const data = await adminProductService.addProductService(req, res);
  res.status(201).json({
    success: true,
    message: "new product Added",
  });
};
// update product

exports.updateProduct = async (req, res) => {
  const data = await adminProductService.updateProductService(req, res);
  res.status(204).json({
    success: true,
    message: "product deatils updated",
  });
};
// delete
exports.deleteProduct = async (req, res) => {
   await adminProductService.deleteProductSevice(req, res);
  res.status(204).json({
    success: true,
    message: "product deatils deleted",
  });
};
