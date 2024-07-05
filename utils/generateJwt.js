const jwt = require("jsonwebtoken")

const generateJwtToken = (payload,secretKey,duration) => {
  
    return jwt.sign({userId: payload.userId,role:payload.role},secretKey,{
         expiresIn: duration
     })
 }


 module.exports = generateJwtToken;