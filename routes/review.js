const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");

//controller
const reviewController=require("../controllers/reviews.js");

//reviews route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createNewReview));

//review delete route
router.delete("/:id2",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview));

module.exports=router;