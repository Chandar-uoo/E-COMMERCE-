const validateProductInput = (req, res, next) => {
  const { ProductName, category, description, price, img, stock, rating } = req.body.updateFields;

  if (
    !ProductName || typeof ProductName !== 'string' || ProductName.trim().length === 0 ||
    !category || typeof category !== 'string' || category.trim().length === 0 ||
    !description || typeof description !== 'string' || description.trim().length === 0 ||
    price === undefined || typeof price !== 'number' || price <= 0 ||
    !img || typeof img !== 'string' || img.trim().length === 0 ||
    stock === undefined || typeof stock !== 'number' || stock < 0 ||
    rating === undefined || typeof rating !== 'number' || rating < 0 || rating > 5
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid or missing details.",
    });
  }

  next(); // continue to controller
};
module.exports= {validateProductInput}
