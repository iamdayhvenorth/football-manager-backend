const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const validateUser = require("../validators/userValidator")
const validateLogin = require("../validators/loginValidator")
const User = require("../models/userModel")
const EmailVerification = require("../models/userEmailVerificationModel")
const sendEmail = require("../utils/sendEmail")
const Token = require("../models/tokenModel")
const validatePassword = require("../validators/passwordValidator")
const generateJwtToken = require("../utils/generateJwt")
const RefreshToken = require("../models/refreshTokenModel")
const asyncHandler = require("express-async-handler")
const  handler = require("../middlewares/errorHandler")

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
        const accessToken = generateJwtToken({userId:newUser._id, role:newUser.role},process.env.JWT_ACCESS_TOKEN_KEY, "15m")
        const refreshToken = generateJwtToken({userId:newUser._id, role:newUser.role},process.env.JWT_REFRESH_TOKEN_KEY, "1d")
         

        // send token to client through cookie- httpOnly
        res.cookie("jwt",refreshToken,{
            httpOnly: true,
            expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: "none",
            secure: true
        })
     
         // generate email verification token
         const verificationToken = crypto.randomBytes(32).toString("hex") + newUser._id

        // send user a welcome message and email verification link
        const verifyLink = `${process.env.ORIGIN_URL}/auth/verify-email/?verifytoken=${verificationToken}&email=${newUser.email}`
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
        
        // save verification token in database
        await EmailVerification.create({
            userId: newUser._id, 
            verificationToken,
            createdAt: Date.now(),
            expiresAt: new Date(Date.now() + (20 * 60 * 1000))  // 20 minutes
        })

        // save refresh token in database
        await RefreshToken.create({
            userId: newUser._id,
            token: refreshToken,
            createdAt: Date.now()
        })
        
         // send verification email to user
        await sendEmail(process.env.AUTH_EMAIL,newUser.email, "Email Verification", message)

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

// const loginUser = asyncHandler( async (req,res) => {
//     // validate all the req.body info 
//     const {error,value} = validateLogin.validate({...req.body})
//     if(error) {
//         res.status(400)
//          throw new Error( error.details[0].message)
//     } 
//     const {email, password} = value
//         // check if user exist in the database
//         const user = await User.findOne({email})
//         // if user exist ? check password : => User not found
//         if(!user) {
//             res.status(401)
//             throw new Error("Incorrect email or password")
//         }
        
//         // check if password match
//         const isMatch = await bcrypt.compare(password, user.password)
//         if(!isMatch) {
//             res.status(401)
//             throw new Error("Incorrect email or password")
//         }
            
//         // generate jwt token
//         const accessToken = generateJwtToken({userId:user._id, role:user.role},process.env.JWT_ACCESS_TOKEN_KEY, "40s")
//         const refreshToken = generateJwtToken({userId:user._id, role:user.role},process.env.JWT_REFRESH_TOKEN_KEY, "1d")
        
//         // save refresh token in database
//         await RefreshToken.create({
//             userId: user._id,
//             token: refreshToken,
//             createdAt: Date.now(),
//             expiresIn: new Date(Date.now() + (24 * 60 * 60 * 1000))  // 24 hours
//         })
//         // send token to client through cookie- httpOnly
//         res.cookie("jwt",refreshToken,{
//             httpOnly: true,
//             maxAge: 1000 * 60 * 60 * 24,
//             sameSite: "none",
//             secure: true  //you can remove or set to false during testing in devlopment mode  while using Thunder client 
//         })
//         return res.status(200).json({accessToken})
    
    
// })

const loginUser = async (req,res) => {
    // validate all the req.body info 
    const {error,value} = validateLogin.validate({...req.body})
    if(error) return res.status(400).json({errMsg: error.details[0].message})

    const {email, password} = value
    
    try {
        // check if user exist in the database
        const user = await User.findOne({email})
        // if user exist ? check password : => User not found
        if(!user) return res.status(400).json({errMsg: "Incorrect email or password"})
        
        // check if password match
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) return res.status(401).json({errMsg: "Incorrect email or password"})
        

        const foundToken = await RefreshToken.findOne({
            userId: user._id, 
            expiresIn: {$gte: Date.now()}
        })
       
        const accessToken = generateJwtToken({userId:user._id, role:user.role},process.env.JWT_ACCESS_TOKEN_KEY, "4h")
       
        if(!foundToken) {
            // save refresh token in database
             // generate jwt token
            const refreshToken = generateJwtToken({userId:user._id, role:user.role},process.env.JWT_REFRESH_TOKEN_KEY, "1d")
    
            await RefreshToken.create({
                userId: user._id,
                token: refreshToken,
                createdAt: Date.now(),
                expiresIn: new Date(Date.now() + (24 * 60 * 60 * 1000))  // 24 hours
             })

              // send token to client through cookie- httpOnly
            res.cookie("jwt",refreshToken,{
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                sameSite: "none",
                secure: true  //you can remove or set to false during testing in devlopment mode  while using Thunder client 
            })
        
            return res.status(200).json({accessToken})
        }else {
            
            // send token to client through cookie- httpOnly
            res.cookie("jwt",foundToken.token,{
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
                sameSite: "none",
                secure: true  //you can remove or set to false during testing in devlopment mode  while using Thunder client 
            })
            return res.status(200).json({accessToken})
        }
       
        
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
        sameSite: "none",
        secure: true
    })
    return res.status(200).json({msg: "Successfully logged out"})
}

const getUserProfile = async (req,res) => {
   
    const authenticatedUserId = req.user.userId
    
    // check if authenticated user is the same as the user whose profile is requested from the params
    
    if(!authenticatedUserId) return res.status(401).json({errMsg: "Unauthorized"}) 
        
        try{
            // check if user with the ID exist in the DB
            const user = await User.findById({_id:authenticatedUserId}).select('-password')
            if(!user) return res.status(404).json({errMsg: "User with the provided ID not found"})
            return res.status(200).json(user)
        }catch(err) {
            console.log(err.message)
            return res.sendStatus(500)
        }
}

const updateUserProfile = async (req,res) => {
  
       const authenticatedUserId = req.user.userId
      
       if(!authenticatedUserId) return res.status(401).json({errMsg: "Unauthorized"}) 
      
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
} 

const getAllUsers = async (req,res) => {
    
    const {search,page,startDate,endDate,limit} = req.query
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)

    const skip = (pageNumber - 1) * limitNumber
    try{
        const filter = {}

        if(search) {
            filter.$or = [
                { firstName: {$regex: search, $options: 'i'} },
                { lastName: {$regex: search, $options: 'i'} },
                { email: {$regex: search, $options: 'i'} }
            ]
        }else if(startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }else if(startDate) {
            filter.createdAt = {
                $gte: new Date(startDate)
            }
        }else if(endDate) {
            filter.createdAt = {
                $lte: new Date(endDate)
            }
        }

        // get all users from the database
        const users = await User.find(filter).sort({createdAt: "desc"}).skip(skip).limit(limitNumber).select('-password')
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

           // check new password length, it should be minimum of 6 characters long
        if(newPassword.length < 6) return res.status(400).json({errMsg: "New password should be minimum of 6 characters long"})

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

const forgotPassword = async (req,res) => {
    // get email from the request
    const {email} = req.body
    if(!email) return res.status(400).json({errMsg: "Please provide email"})
    
    try {
        // check if email exists in the database
    const user = await User.findOne({email})
    if(!user) return res.status(404).json({errMsg: "No user found with the provided email"})

    // if token exist in the db, delete before generating a new token
    let foundToken = await Token.findOne({userId: user._id})
    if(foundToken) await Token.deleteOne({_id: foundToken._id})
    // if user found generate a reset password token and save it to the user's email
    const resetToken = crypto.randomBytes(32).toString("hex") + user._id
    
    // hash the reset token before sendin to the db
    const hashedResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
 
    // save token to the databse
    await Token.create({
        userId: user._id,
        token: hashedResetToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + (20 * 60 * 1000)
    })
    const resetLink = `${process.env.CLIENT_URL}/resetpassword/?token=${resetToken}`
    
    const message = `
        <h2>Hello ${user.firstName}</h2>
        <p>You requested a password reset for your account. If this was not requested by you please ignore.</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 20 minutes.</p>
        <p>Thank you for using our platform!</p>
        
        <p>Regards,</p>
        <p>DaveCodeSolutions Team.</p>
        `
        
    // send email to the user with the reset link
    await sendEmail(process.env.AUTH_EMAIL,user.email, "Password Reset Request", message)
    
    return res.status(200).json({msg: "Password reset email sent successfully"})
    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500)
    }
 
}

const resetPassword = async (req,res) => {
    // get token from the request query
    const {token} = req.query

    // get the password from the req.body and validate
    const {error,value}= validatePassword.validate({...req.body})
    if(error) return res.status(400).json({errMsg: error.details[0].message})
    const {newPassword, confirmNewPassword} = value


    if(!newPassword || !confirmNewPassword) return res.status(400).json({errMsg: "Please fill in all fields"})
    // check if newpass matches confirmpass
    if(newPassword!== confirmNewPassword) return res.status(400).json({errMsg: "New password and confirm password do not match"})

    // hash the token to compare with the hashed token stored in the db
    const resetToken = crypto.createHash("sha256").update(token).digest("hex")
    
    try {
        const foundToken = await Token.findOne({
            token: resetToken,
            expiresAt: {$gte: Date.now()} // check if existing time is still greater the current time.. meaning it has not exp
        })
    
        if(!foundToken) return res.status(404).json({errMsg: "Invalid or expired token"})
        
        
        const user = await User.findOne({ _id: foundToken.userId}).select("-password")
        if(!user) return res.status(404).json({errMsg: "User not found"})
    
        // update the existing user password with the new password sent from the body
        user.password = newPassword
        await user.save()
        return res.status(200).json({success: true, msg: "Password reset successfully, Please Login"})

    } catch (error) {
        console.log(error.message)
        return res.sendStatus(500)
    }
}

const resetEmaiLink = async (req,res) => {
    const {userId} = req.user

    try {
         // check if user exist in the database
    const user = await User.findById({_id:userId}).select("-password")
    if(!user) return res.status(404).json({errMsg: "User not found"})


    // if token exist in the db, delete before generating a new token
    const foundToken = await EmailVerification.findOne({userId: user._id})
    if(foundToken) await EmailVerification.deleteOne({_id: foundToken._id})
    
    // generate email verification token
    const newToken = crypto.randomBytes(32).toString("hex") + user._id
    
    await EmailVerification.create({
        userId: user._id,
        verificationToken: newToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + (20 * 60 * 1000) // 20 minutes expiry time
     })
    const verifyLink = `${process.env.ORIGIN_URL}/auth/verify-email/?verifytoken=${newToken}&email=${user.email}`
    
    const message = `
        <h2>Hello, ${user.firstName}</h2>
        <p>Here is your email verification link, if verified already please ignore</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>This link will expire in 20 minutes.</p>

        <p>Best regards,</p>
        <p>DaveCodeSolutions Team</p>
    `
        await sendEmail(process.env.AUTH_EMAIL,user.email, "Email Verification", message)

    //  send a notification link to user via email
    return res.status(200).json({msg: "A verification link sent to your email successfully"})
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)

    }
}

const verifyEmail = async (req,res) => {
    const {verifytoken,email} = req.query
    if(!verifytoken) return res.status(400).json({errMsg: "Token and Email required for verification"})

    try {
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({errMsg: "User not found"})

        const foundToken = await EmailVerification.findOne({
            userId: user._id,
            verificationToken: verifytoken,
            expiresAt: {$gte: Date.now()} // check if existing time is still greater the current time.. meaning it has not exp
        })
    
        if(!foundToken) return res.status(404).json({errMsg: "Invalid or expired token"})
        if(user.isEmailVerified === true ) return res.status(409).json({errMsg: "Email Verified Already"})

        user.isEmailVerified = true
        await user.save()

        // if token exist in the db, delete it as it is now verified
        await EmailVerification.deleteOne({_id: foundToken._id})

        // send a notification to user via email
        const message = `
        <h2>Hello, ${user.firstName}</h2>
        <p>Your email verification has been successful.</p>
        <p>Thank you for verifying your email.</p>
        <p>Best regards,</p>
        <p>DaveCodeSolutions Team</p>
        `
        await sendEmail(process.env.AUTH_EMAIL,user.email, "Email Verification Success", message)
        return res.status(200).json({msg: "Email verified successfully"})
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }

}

const handleRefreshToken = async (req,res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) return res.sendStatus(401)
    const refreshToken = cookies.jwt

    try {
        const foundToken = await RefreshToken.findOne({
            token: refreshToken,
            expiresIn: {$gte: Date.now()} // check if existing time is still greater the current time.. meaning it has not exp
        })

        if(!foundToken) return res.status(401).json({errMsg: "No token found, please login "})

        const user = await User.findById(foundToken.userId).select("-password")
        if(!user) return res.sendStatus(401)

        // verify the existin token
        jwt.verify(refreshToken,process.env.JWT_REFRESH_TOKEN_KEY,(err,decoded) => {
            if(err ) return res.sendStatus(403)
            // generate new JWT token and refresh token
            const accessToken = generateJwtToken(
                {userId:decoded.userId, role:decoded.role},
                process.env.JWT_ACCESS_TOKEN_KEY,
                 "2m"
            )
            res.json({accessToken})
        })
    } catch (error) {
        console.log(error)
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
    logoutUser,
    forgotPassword,
    resetPassword,
    resetEmaiLink,
    verifyEmail,
    handleRefreshToken
}