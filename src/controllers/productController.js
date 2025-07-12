const  productServices = require("../services/productServices");

exports.searchProduct = async (req, res) => {

    const { products, total, limit, page } =  await productServices.searchService(req,res);

    res.status(200).json({
        success: true,
        message: 'successfull',
        result: products,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        limit: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevpage: page > 1
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