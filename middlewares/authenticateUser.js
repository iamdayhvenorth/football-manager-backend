const jwt = require("jsonwebtoken")

const authenticateUser = (req,res,next) => {
    // check if theres an existing accesstoken in the header
    const token = req.headers["authorization"].split(" ")[1]
    if (!token) return res.status(401).json({ message: "Access denied. Invalid token." })

    // verify the token
    jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded) => {
        if(err) return res.sendStatus(403)
        req.user = decoded.userId
        next()
    })
}

module.exports = authenticateUser;