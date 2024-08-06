const express = require("express")
const {
    registerUser,
    loginUser,
    changePassword,
    logoutUser,
    forgotPassword,
    resetPassword,
    resetEmaiLink,
    verifyEmail,
    handleRefreshToken
} = require("../controllers/authController")

const authenticateUser = require("../middlewares/authenticateUser")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.put("/profile/change-password", authenticateUser,changePassword)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword", resetPassword)
router.get("/emailtoken", authenticateUser, resetEmaiLink)
router.get("/verify-email", verifyEmail)
router.post("/refreshtoken", handleRefreshToken)






module.exports = router