const authorizePermission = (...allowedRoles) => {

   return  (req,res,next) => {
       // check if user role is equal to aRmin cos all admin can view all users
       
           const {role} = req.user

           if(!role) return res.sendStatus(401)

            const allowedRolesArr = [...allowedRoles]
            const assignedRoles = [role]
            
            const verifyRoles = assignedRoles.map(r => allowedRolesArr.includes(r)).find(x => x === true)
            
            if(!verifyRoles) return res.sendStatus(401)
            next()
    }
}


   

module.exports = authorizePermission;