const { default: mongoose } = require("mongoose");

const reviewModel = mongoose.Schema({
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productModel',
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
    
})
reviewModel.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("reviewModel", reviewModel);


