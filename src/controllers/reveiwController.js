
const reviewServices =  require("../services/reviewServices");

exports.createtProductReview =   async (req,res) => {
    const data =  await reviewServices.createReviewService(req,res);
    
     res.status(200).json({
        success: true,
        message: ' review created successfully',
        result:{
             data,
             isExist:true,
        },
        
    })
    
}