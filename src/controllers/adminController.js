
const adminServices = require("../services/adminServices");

exports.fetchProduct = async (req, res) => {
    const { products, total, limit, page } = await adminServices.fetchProductService(req, res);
    res.status(200).json({
        success: true,
        message: "admin fetched all products",
        result: products,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevpage: page > 1,
    })
}
exports.addProduct = async (req, res) => {
    const data = await adminServices.addProductService(req, res);
    res.status(200).json({
        success: true,
        message: "new product Added",
        result: data
    })
}
// update product

exports.updateProduct = async (req, res) => {
    const data = await adminServices.updateProductService(req, res);
    res.status(200).json({
        success: true,
        message: "product deatils updated",
        result: data,
    })
}
// delete 
exports.deleteProduct = async (req, res) => {
    const data = await adminServices.deleteProductSevice(req, res);
    res.status(200).json({
        success: true,
        message: "product deatils deleted",
        result: data,
    })
}
exports.fetchUser = async (req, res) => {
    const { users, total, limit, page } = await adminServices.fetchUserService(req, res);
    res.status(200).json({
        success: true,
        message: "admin fetched all users",
        result: users,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevpage: page > 1,
    })
}

// fetch Order
exports.fetchOrder = async (req, res) => {
    const { orders, total, limit, page } = await adminServices.fetchOrdersService(req, res);
    res.status(200).json({
        success: true,
        message: "admin fetched all order",
        result: orders,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevpage: page > 1,
    })
}

// fetch all orders =  paid & processing

exports.ordersToFullfill = async (req, res) => {
    const { orders, total, limit, page } = await adminServices.ordersToFullfillService(req, res);
    res.status(200).json({
        success: true,
        message: "admin fetched all order with payment status paid and order status proceesing",
        result: orders,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevpage: page > 1
    })
}
exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const data = await adminServices.updateOrderStatusService(req, res);
    res.status(200).json({
        success: true,
        message: `admin replaced order status proceesing to ${status} `,
        result: data
    })
}