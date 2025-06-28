const userServices = require("../services/userServices");

exports.userCheck = (req, res) => {
    const user = userServices.userCheckService(req,res);
    res.status(200).json({
        success: true,
        message: "user details",
        result: {
            id: user._id,
            name: user.name,
            address: user.address,
            DOB: user.DOB,
            gender: user.gender,
            image: user.image,
            phoneNo: user.phoneNo,
            cart: user.cart
        }
    })
}