
const adminServices = require("../services/adminServices");

exports.fetchProduct =  async(req,res)=>{
    const data =  await adminServices.fetchProductService(req,res);
    res.status(200).json({
        success:true,
        message:"admin fetched all products",
        result:data
    }) 
}