const userModel = require("../../models/user");

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
