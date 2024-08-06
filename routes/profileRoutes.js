const express = require("express")
const { 
    deleteProfile, 
    getProfile, 
    updateProfile, 
    getAllUsers 
} = require("../controllers/profileController")

const authenticateUser = require("../middlewares/authenticateUser")
const authorizePermission = require("../middlewares/authorizedRoles")


const router = express.Router()
router.put("/:profileId", authenticateUser, updateProfile)
router.get("/all", authenticateUser, authorizePermission("Admin"), getAllUsers)
router.get("/", authenticateUser, getProfile)

router.delete("/:profileId",authenticateUser, authorizePermission("Admin"), deleteProfile)

module.exports = router