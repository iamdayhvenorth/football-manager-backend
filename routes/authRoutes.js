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
const authorizePermission = require("../middlewares/authorizedRoles")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/profile", authenticateUser, getUserProfile)
router.put("/profile/change-password", authenticateUser,changePassword)
router.put("/profile", authenticateUser, updateUserProfile)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword", resetPassword)
router.get("/emailtoken", authenticateUser, resetEmaiLink)
router.get("/verify-email", verifyEmail)
router.post("/refreshtoken", handleRefreshToken)


router.get("/users", authenticateUser, authorizePermission("Admin"), getAllUsers)





module.exports = router