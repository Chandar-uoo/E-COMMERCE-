const AppError = require("../utils/AppError");

exports.userCheckService = (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError("Please login", 401);
    }
    return user;
}