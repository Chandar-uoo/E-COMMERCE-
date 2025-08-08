const express = require("express");
const reviewRouter = express.Router();
const {auth} = require("../middleware/authValidator");
const catchAsync = require('../utils/catchAsync')
reviewRouter.use(express.json());

const reviewController = require("../controllers/reveiwController")

reviewRouter.post("/:id",auth,catchAsync(reviewController.createtProductReview));

module.exports = {reviewRouter}; 

