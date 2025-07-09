
const adminServices = require("../services/adminServices");

exports.fetchProduct =  async(req,res)=>{
    const data =  await adminServices.fetchProductService(req,res);
    res.status(200).json({
        success:true,
        message:"admin fetched all products",
        result:data
    }) 
}
exports.addProduct = async(req,res)=>{
    const data =  await adminServices.addProductService(req,res);
    res.status(200).json({
        success:true,
        message:"new product Added",
        result : data
    })
}
// update product

exports.updateProduct =  async(req,res)=>{
    const data =  await adminServices.updateProductService(req,res);
    res.status(200).json({
        success:true,
        message:"product deatils updated",
        result:data,
    })
}
// delete 
exports.deleteProduct =  async(req,res)=>{
    const data =  await  adminServices.deleteProductSevice(req,res);
    res.status(200).json({
        success:true,
        message:"product deatils deleted",
        result:data,
    })
}
exports.fetchUser = async(req,res)=>{
    const data =  await adminServices.fetchUserService(req,res);
    res.status(200).json({
        success:true,
        message:"admin fetched all users",
        result:data
    }) 
}

// fetch Order
exports.fetchOrder = async(req,res)=>{
    const data =  await adminServices.fetchOrdersService(req,res);
    res.status(200).json({
        success:true,
        message:"admin fetched all order",
        result:data
    }) 
}

