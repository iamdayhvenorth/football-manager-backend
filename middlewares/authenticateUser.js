const jwt = require("jsonwebtoken")
const RefreshToken = require("../models/refreshTokenModel")


const authenticateUser =  (req,res,next) => {
    // check if theres an existing accesstoken in the header
    const authHeader = req.headers["authorization"]
    if(!authHeader) return res.status(401).json({ errMsg: "Unauthorized or session expired, please login" })
    const token = authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ errMsg: "Access denied. Invalid token." })

    // verify the token
    jwt.verify(token,process.env.JWT_ACCESS_TOKEN_KEY, (err,decoded) => {
        if(err) return res.sendStatus(403)
        req.user = decoded
        next()
    })
}

module.exports = authenticateUser;

