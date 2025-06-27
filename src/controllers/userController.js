 const AppError =  require('../utils/AppError')
exports.userCheck = (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError("Please login", 401);
    }
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