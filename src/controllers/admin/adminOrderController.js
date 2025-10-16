const adminOrderService =  require("../../services/admin/adminOrderService")

// fetch Order
exports.fetchOrder = async (req, res) => {
  const { orders, total, limit, page } = await adminOrderService.fetchOrdersService(
    req,
    res
  );
  res.status(200).json({
    success: true,
    message: "admin fetched all order",
    result: {
      data: orders,
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

exports.updateOrderStatus = async (req, res) => {
  await adminOrderService.updateOrderStatusService(req, res);
  res.status(204).json({
    success: true,
    message: "admin replaced order status proceesing to shipped",
  });
};
