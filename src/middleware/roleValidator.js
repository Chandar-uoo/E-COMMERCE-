
const roleCheck = (requiredRole) => {
    return (req,res,next)=>{
        if(!req.user){
            return res.status(404).json({
                success:false,
                message:"unAuthorised"
            })
        }
        if(req.user?.role !== requiredRole){
            return res.status(403).json({
                success:false,
                message:"Access denied"
            })
        }
        next();
    }
}
module.exports = {roleCheck}