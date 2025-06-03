const jwt = require("jsonwebtoken");
const userModel = require("../models/user")
const auth = async (req,res,next) => {
    const token  = req.cookies.token;
    if(!token){
         return res.status(401).json({
            message:"please login"
        })
    }
    try {
        const secretkey = process.env.SECRET_KEY;
        const decoded = await jwt.verify(token,secretkey);
        const user = await userModel.findById(decoded.id);
        req.user= user;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message:"please login"
        })
        
    }
}
module.exports = {auth,}