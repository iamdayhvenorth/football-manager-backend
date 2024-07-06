const authorizePermission = (...allowedRoles) => {

   return  (req,res,next) => {
       // check if user role is equal to aRmin cos all admin can view all users
       
           const {role} = req.user
           if(!role) return res.senStatus(401)

            const allowedRolesArr = [...allowedRoles]
            const assignedRoles = [role]

            console.log(allowedRolesArr)
            console.log(assignedRoles)
            
            const verifyRoles = assignedRoles.map(r => allowedRoles.includes(r)).find(x => x === true)
            console.log(verifyRoles)
            if(!verifyRoles) return res.sendStatus(401)
            next()
    }
}


   

module.exports = authorizePermission;