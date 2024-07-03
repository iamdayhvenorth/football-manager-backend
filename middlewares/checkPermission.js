

const authorizePermission =  (req,res,next) => {
    // check if user role is equal to admin cos all admin can view all users
        const {role} = req.user
        if(role === "Admin") {
            next();
        } else {
            return res.status(403).json({msg:"Unauthorized access. Only admin can access this endpoint."})
        }
    }
   

module.exports = authorizePermission;