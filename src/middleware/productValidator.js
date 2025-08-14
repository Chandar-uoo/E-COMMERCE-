const AppError = require("../utils/AppError");

const validateProductInput = (req, res, next) => {
  if (!req.body.updateFields) {
    throw new AppError("Request body must contain updateFields", 400);
  }

  const {
    title,
    category,
    description,
    brand,
    price,
    stock,
    images,
    thumbnail,
    weight,
    warrantyInformation,
    shippingInformation,
    returnPolicy,
    availabilityStatus,
    tags,
    dimensions
  } = req.body.updateFields;

  // Helper for string validation
  const isNonEmptyString = (val) =>
    typeof val === "string" && val.trim().length > 0;

  // Helper for positive number
  const isPositiveNumber = (val) =>
    typeof val === "number" && !isNaN(val) && val > 0;

  // Helper for non-negative integer
  const isNonNegativeInteger = (val) =>
    Number.isInteger(val) && val >= 0;

  if (
    !isNonEmptyString(title) ||
    !isNonEmptyString(category) ||
    !isNonEmptyString(description) ||
    !isNonEmptyString(brand) ||
    !isPositiveNumber(price) ||
    !isNonNegativeInteger(stock) ||
    !Array.isArray(images) || images.length === 0 || !images.every(isNonEmptyString) ||
    !isNonEmptyString(thumbnail) ||
    !isPositiveNumber(weight) ||
    !isNonEmptyString(warrantyInformation) ||
    !isNonEmptyString(shippingInformation) ||
    !isNonEmptyString(returnPolicy) ||
    !isNonEmptyString(availabilityStatus) ||
    !Array.isArray(tags) || tags.length === 0 || !tags.every(isNonEmptyString) ||
    !dimensions ||
      !isPositiveNumber(dimensions.width) ||
      !isPositiveNumber(dimensions.height) ||
      !isPositiveNumber(dimensions.depth)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing product details.",
    });
  }

  next();
};

module.exports = { validateProductInput };
