 const AppError = require("../utils/AppError");
 const { default: mongoose } = require("mongoose");
const reviewModel =  require("../models/reviewModel");
const productModel = require("../models/productModel")


exports.createReviewService = async (req,res) => {
    const {comment,rating} =  req.body;
    const {productId} = req.params;
    const user =  req.user;
    if(!comment || !rating ||!productId || !user){
        throw new AppError ("BAD_REQUEST",400)
    };
    // validate string  & rating
  if (typeof comment !== "string" || comment.trim().length < 1) {
  throw new AppError("Invalid comment", 400);
}

if (typeof rating !== "number" || rating < 1 || rating > 5) {
  throw new AppError("Invalid rating", 400);
}

    const isProduct =  await productModel.exists({_id:productId});
    if(!isProduct){
         throw new AppError ("NO PRODUCT FOUND",404)
    }
    // checking user already review this product
    const isExisting =  await reviewModel.findOne({
        user:user._id,
        product:productId
    });
    if(isExisting){
         throw new AppError ("Already user review this product",400)
    }
    const newReview =  await reviewModel.create({
        user:user._id,
        product:productId,
        comment,
        rating
    });
    return newReview;
}