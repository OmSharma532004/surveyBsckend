const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
    login,
    signup,
    logout,

  } = require("../controller/Auth")

  // Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup",  signup)
router.post("/logout",  logout)



  module.exports = router