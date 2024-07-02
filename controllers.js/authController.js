const validateUser = require("../validators/userValidator")
const User = require("../models/userModel")

const registerUser =  async (req,res) => {

    // validate all the req.body info 
    const {error,value} = validateUser.validate({...req.body})
   
    if(error) return res.status(400).json({errMsg: error.details[0].message})
    
    const {firstName, lastName, password,dob,email,phone,gender,age} = value

    // check if user already exist in the database 
    const userExist = await User.findOne({email})
    
    // if true ? user already exist : create new user
    if(userExist) return res.status(400).json({errMsg: "User already exist with this email"})

    try {
        const newUser = await User.create({firstName, lastName, password,dob,email,gender})
        return res.status(201).json({
            id: newUser._id,
            name: newUser.firstName + " " + newUser.lastName,
            dob: newUser.dob,
            email: newUser.email,
            gender: newUser.gender
        })
        
    } catch (err) {
        console.log(err.message)
        return res.sendStatus(500)
    }
    
}


module.exports = {registerUser}