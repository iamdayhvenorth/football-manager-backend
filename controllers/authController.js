const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const validateUser = require("../validators/userValidator")
const validateLogin = require("../validators/loginValidator")
const User = require("../models/userModel")
const EmailVerification = require("../models/userEmailVerificationModel")
const sendEmail = require("../utils/sendEmail")

const generateJwtToken = (userId) => {
   return jwt.sign({userId},process.env.JWT_SECRET_KEY,{
        expiresIn: "1d"
    })
}


const registerUser =  async (req,res) => {

    // validate all the req.body info 
    const {error,value} = validateUser.validate({...req.body})
   
    if(error) return res.status(400).json({errMsg: error.details[0].message})
    
    const {firstName, lastName, password,dob,email,gender} = value

    // check if user already exist in the database 
    const userExist = await User.findOne({email})
    
    // if true ? user already exist : create new user
    if(userExist) return res.status(400).json({errMsg: "User already exist with this email"})

    try {
        const newUser = await User.create({firstName, lastName, password,dob,email,gender})
        
        // generate jwt token
        const accessToken = generateJwtToken(newUser._id) 


        // send token to client through cookie- httpOnly
        res.cookie("jwt",accessToken,{
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: "none",
            secure: true
        })
     
         // generate email verification token
         const verificationToken = crypto.randomBytes(32).toString("hex") + newUser._id

        // send user a welcome message and email verification link
        const verifyLink = `${process.env.CLIENT_URL}/auth/verify-email/?token=${verificationToken}&email=${newUser.email}`
        // const subject = "Email Verification"
        const message = `
            <h2>Welcome to our platform, ${newUser.firstName} ${newUser.lastName}!</h2>
            <p>Please verify your email by clicking on the link:</p>
            <a href="${verifyLink}">${verifyLink}</a>
            <p>This link will expire in 20minutes.</p>
            <p>Thank you for joining us!</p>


            <p>Best regards,</p>
            <p>DaveCodeSolutions</p>
        `
        await sendEmail(process.env.AUTH_EMAIL,newUser.email, "Email Verification", message)
        
        
        // save verification token in database
        await EmailVerification.create({userId: newUser._id, verificationToken})
       
        return res.status(201).json({
            id: newUser._id,
            name: newUser.firstName + " " + newUser.lastName,
            dob: newUser.dob,
            email: newUser.email,
            gender: newUser.gender,
            isEmailVerified: newUser.isEmailVerified,
            accessToken
        })
        
    } catch (err) {
        console.log(err.message)
        return res.sendStatus(500)
    }
    
}

const loginUser = async (req,res) => {
    // validate all the req.body info 
    const {error,value} = validateLogin.validate({...req.body})
    if(error) return res.status(400).json({errMsg: error.details[0].message})

    const {email, password} = value
    
    try {
        // check if user exist in the database
        const user = await User.findOne({email})
        // if user exist ? check password : => User not found
        if(!user) return res.status(400).json({errMsg: "User not found"})
        
        // check if password match
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({errMsg: "Incorrect email or password"})
            
        // generate jwt token
        const accessToken = generateJwtToken(user._id)
        
        // send token to client through cookie- httpOnly
        res.cookie("jwt",accessToken,{
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: "none",
            secure: true
        })
        return res.sendStatus(200)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
    
}


module.exports = {registerUser,loginUser}