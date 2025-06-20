const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {reviewSchema } = require("../schema.js");

const validateReview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

//reviews route
router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newRev=new Review(req.body.review);
    listing.reviews.push(newRev);

    await newRev.save();
    await listing.save();
    console.log("review saved");
    res.redirect(`/listings/${listing._id}`);
}));

//review delete route
router.delete("/:id2",wrapAsync(async (req,res)=>{
    let { id: listingId, id2: reviewId } = req.params;
    let delreview=await Review.findByIdAndDelete(reviewId);
    let listing=await Listing.findByIdAndUpdate(listingId,{$pull: {reviews:reviewId}},{new:true});
    console.log("deleted review", delreview)
    console.log("updated listing reviews",listing);
    res.redirect(`/listings/${listingId}`);
}));

module.exports=router;