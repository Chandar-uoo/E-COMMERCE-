const  productServices = require("../services/productServices");

exports.searchProduct = async (req, res) => {

    const  products  =  await productServices.getProductbyFilterService(req,res);

    res.status(200).json({
        success: true,
        message: 'successfull',
        result: products,
    })
}
exports.allProducts = async (req, res) => {

    const  products = await productServices.allProductService(req,res) ;
    res.status(200).json({
        sucess: true,
        message: "suceess",
        result: products,
    });
}
exports.singleProduct = async (req, res) => {

    const data =  await productServices.singleProductService(req,res);
    res.status(200).json({
        success: true,
        message: "sucess",
        result: data
    })
}