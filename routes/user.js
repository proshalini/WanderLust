const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");

//controller
const userController=require("../controllers/users.js");

//signup get and post
router.route("/signup")
.get(userController.signUpForm )
.post(wrapAsync(userController.registerUser));

//login get and post route
router.route("/login")
.get(userController.loginForm)
.post(saveRedirectUrl,
passport.authenticate("local",{failureRedirect: '/login', failureFlash: true }),userController.loginUser);


router.get("/logout",userController.logoutUser);

module.exports = router;