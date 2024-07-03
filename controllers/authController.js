const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const validateUser = require("../validators/userValidator")
const validateLogin = require("../validators/loginValidator")
const User = require("../models/userModel")
const EmailVerification = require("../models/userEmailVerificationModel")
const sendEmail = require("../utils/sendEmail")

const generateJwtToken = (payload) => {
   return jwt.sign({userId: payload._id,role:payload.role},process.env.JWT_SECRET_KEY,{
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
        const accessToken = generateJwtToken(newUser) 


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
        const accessToken = generateJwtToken(user)
        
        // send token to client through cookie- httpOnly
        res.cookie("jwt",accessToken,{
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: "none",
            secure: true
        })
        return res.status(200).json({accessToken})
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
    
}

const logoutUser = async (req,res) => {
    res.cookie("jwt","",{
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        maxAge: 1000 * 60 * 60 * 24,
        sameSite: "none",
        secure: true
    })
    return res.status(200).json({msg: "Successfully logged out"})
}

const getUserProfile = async (req,res) => {
    // get userId from url params to verify from the database
    const {userId} = req.params
    const authenticatedUserId = req.user.userId
    // check if authenticated user is the same as the user whose profile is requested from the params
    if(authenticatedUserId  === userId) {
        try{
            // check if user with the ID exist in the DB
            const user = await User.findById({_id:authenticatedUserId}).select('-password')
            if(!user) return res.status(404).json({errMsg: "User with the provided ID not found"})
            return res.status(200).json(user)
        }catch(err) {
            console.log(err.message)
            return res.sendStatus(500)
        }
    }else{
        return res.status(401).json({errMsg: "Unauthorized"})
       }
}

const updateUserProfile = async (req,res) => {
  
       // get userId from url params to verify from the database
       const {userId} = req.params
       const authenticatedUserId = req.user.userId
       // check if authenticated user is the same as the user whose profile is requested from the params
       if(authenticatedUserId  === userId) {
           try{
               // check if user with the ID exist in the DB
               const user = await User.findById({_id:authenticatedUserId}).select('-password')
               if(!user) return res.status(404).json({errMsg: "User with the provided ID not found"})

               // update user profile with new data from req.body
               const updatedUser = await User.findByIdAndUpdate(
                {_id: authenticatedUserId}, 
                {
                    firstName: req.body.firstName || user.firstName,
                    lastName: req.body.lastName || user.lastName,
                    dob: req.body.dob || user.dob,
                    email: user.email,
                    gender:user.gender
                }, 
                {new: true}
            ).select("-password")
 
               return res.status(200).json(updatedUser)
           }catch(err) {
               console.log(err.message)
               return res.sendStatus(500)
           }
       }else{
        return res.status(401).json({errMsg: "Unauthorized to update user profile"})
       }
} 

const getAllUsers = async (req,res) => {
    
    const {role} = req.user
    if (role !== "Admin") return res.sendStatus(403)
    try{
        // get all users from the database
        const users = await User.find({}).select('-password')
        return res.status(200).json(users)
    }catch(err) {
        console.log(err.message)
        return res.sendStatus(500)
    }
}

const changePassword = async (req,res) => {
    
    // get old password from the request
    const {oldPassword,newPassword,confirmNewPassword} = req.body
    // check authenticated userId to verify if the user exist in the db
    const authenticatedUserId = req.user.userId
    try{
        const user = await User.findById({_id:authenticatedUserId})
        if(!user) return res.status(404).json({errMsg: "User not found, please sign up"})
        
        if(!oldPassword || !newPassword || !confirmNewPassword) return res.status(400).json({errMsg: "Please fill in all fields"})
        if(newPassword !== confirmNewPassword) return res.status(400).json({errMsg: "New password and confirm password do not match"})
        if(oldPassword === newPassword) return res.status(400).json({errMsg: "old password cannot not used as new password"})
        // compare old password with user's existing password in the database
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password)
        if(!isPasswordMatch) return res.status(401).json({errMsg: "Old password is incorrect"})

        user.password = newPassword
        await user.save()
        return res.status(200).json({msg: "Password changed successfully"})
    }catch(err){
        console.log(err.message)
        return res.sendStatus(500)
    }

}


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    changePassword,
    logoutUser
}