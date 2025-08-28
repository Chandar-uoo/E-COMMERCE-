const AppError = require("../utils/AppError");

const roleCheck = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("unAuthorised", 404));
    }

    if (req.user?.role !== requiredRole) {
      return next(new AppError("Access denied", 403));
    }
    next();
  };
};
module.exports = { roleCheck };
