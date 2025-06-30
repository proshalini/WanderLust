const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

//post review route
module.exports.createNewReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newRev=new Review(req.body.review);
    newRev.author=req.user._id;
    listing.reviews.push(newRev);
    await newRev.save();
    await listing.save();
    console.log("review saved",newRev);
    req.flash("success","Review added Successfully :)<3");
    res.redirect(`/listings/${listing._id}`);
};

//delete review
module.exports.destroyReview=async (req,res)=>{
    let { id: listingId, id2: reviewId } = req.params;
    let delreview=await Review.findByIdAndDelete(reviewId);
    let listing=await Listing.findByIdAndUpdate(listingId,{$pull: {reviews:reviewId}},{new:true});
    console.log("deleted review", delreview)
    console.log("updated listing reviews",listing);
    req.flash("success","Review Deleted Successfully !!:(");
    res.redirect(`/listings/${listingId}`);
};