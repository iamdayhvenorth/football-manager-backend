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
    verifyEmail,
    handleRefreshToken
} = require("../controllers/authController")

const authenticateUser = require("../middlewares/authenticateUser")
const authorizePermission = require("../middlewares/authorizePermission")
const checkPermission = require("../middlewares/checkPermission")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logoutUser)
router.get("/profile/:userId", authenticateUser,checkPermission, getUserProfile)
router.put("/profile/change-password", authenticateUser,changePassword)
router.put("/profile/:userId", authenticateUser,checkPermission, updateUserProfile)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword", resetPassword)
router.get("/emailtoken", authenticateUser, resetEmaiLink)
router.get("/verify-email", verifyEmail)
router.get("/refreshtoken", handleRefreshToken)


router.get("/users", authenticateUser, authorizePermission, getAllUsers)





module.exports = router