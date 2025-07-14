const jwt = require("jsonwebtoken");
const userModel = require("../models/user")
const auth = async (req, res, next) => {
    if(!req.cookies.refreshToken){
        return res.status(401).json({
            message: "please login"
        })
    }
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({
            message: "unAuthorized"
        })
    }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = await jwt.verify(token,process.env.ACCESS_TOKEN);
        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            message: "Invalid or expired token"
        })

    }
}
module.exports = { auth,}