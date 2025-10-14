const adminUserService =  require("../../services/admin/adminCustomerservice")

exports.fetchUser = async (req, res) => {
  const { users, total, limit, page } = await adminUserService.fetchUserService(
    req,
    res
  );
  res.status(200).json({
    success: true,
    message: "admin fetched all users",
    result: {
      data: users,
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

