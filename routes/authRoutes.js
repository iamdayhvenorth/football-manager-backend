const express = require("express")
const {
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
    verifyEmail
} = require("../controllers/authController")

const authenticateUser = require("../middlewares/authenticateUser")
const authorizePermission = require("../middlewares/checkPermission")
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/profile/:userId", authenticateUser, getUserProfile)
router.put("/profile/change-password", authenticateUser,changePassword)
router.put("/profile/:userId", authenticateUser, updateUserProfile)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword", resetPassword)
router.get("/emailtoken", authenticateUser, resetEmaiLink)
router.get("/verify-email", verifyEmail)

router.get("/users", authenticateUser, authorizePermission, getAllUsers)





module.exports = router