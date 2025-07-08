const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing");
const {validateListing,isOwner,isLoggedIn}=require("../middleware.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });

//controller
const listingController=require("../controllers/listings.js");

//index route && post
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(listingController.createNewListing));
// .post(upload.single('listing[image]'),(req,res)=>{
//     res.send(req.file);
// })

//new route
router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

//show,edit and delete route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.patch(isLoggedIn,isOwner,validateListing,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));

module.exports=router;