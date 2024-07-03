const express = require("express")
const {registerUser,loginUser,getUserProfile} = require("../controllers/authController")
const authenticateUser = require("../middlewares/authenticateUser")

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/profile/:userId", authenticateUser, getUserProfile)





module.exports = router