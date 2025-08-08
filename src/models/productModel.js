const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true }, // could be changed to ObjectId if referencing Category model
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    tags: [{ type: String }],
    images: [
      {
        type: String, // array of image URLs
      },
    ],
    thumbnail: { type: String },
    weight: { type: Number }, // grams
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      depth: { type: Number, required: true },
    },
    warrantyInformation: { type: String },
    shippingInformation: { type: String },
    returnPolicy: { type: String },
    availabilityStatus: {
      type: String,
      enum: ["In Stock", "Out of Stock", "Low Stock", "Discontinued"],
      default: "In Stock",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
productModel.index({ title: 1 });
productModel.index({ brand: 1 });
productModel.index({ category: 1 });

productModel.virtual("reviews", {
  ref: "reviewModel",
  localField: "_id",
  foreignField: "product",
});
productModel.set("toObject", { virtuals: true });
productModel.set("toJSON", { virtuals: true });

module.exports = mongoose.model("productModel", productModel);
