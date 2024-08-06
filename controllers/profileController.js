const User = require("../models/userModel")


const getProfile = async (req,res) => {
   
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

const updateProfile = async (req,res) => {
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

const deleteProfile = async (req,res) => {
    const {profileId} = req.params
    console.log(profileId)
    try {
        const user = await User.findByIdAndDelete(profileId)
        if(!user) return res.status(404).json({error: "Profile not found"})
        res.status(200).json({message: "Profile deleted successfully"})
    } catch (error) {
        console.error(error)
        res.status(500).json({error: "Server Error"})
    }

}

module.exports = {
    deleteProfile,
    getAllUsers,
    getProfile,
    updateProfile
}