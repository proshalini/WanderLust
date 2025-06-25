const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing");
const { listingSchema, reviewSchema } = require("../schema");

const validateListing=(req,res,next)=>{
    let{error}=listingSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
};

router.get("/",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
//new route
router.get("/new",wrapAsync(async (req,res)=>{
    res.render("./listings/new.ejs");
}));
//index route
router.get("/:id" ,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","The requested listing does not exists :(");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}));
//create route
router.post("/",validateListing,wrapAsync(async (req, res) => {
    let newListing=new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing created successfully !!<3");
    res.redirect("/listings");
}));

//edit
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist :(");
        return res.redirect("./listings");
    }
    res.render("./listings/edit.ejs",{listing});
}));
//update route
router.patch("/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const updatedlist=req.body.listing;
    await Listing.findByIdAndUpdate(id,updatedlist,{ new: true, runValidators: true });
    console.log("updated content",updatedlist);
    req.flash("success","Listing updated successfully :)");
    res.redirect("/listings");
}));

//delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const deletedlist=await Listing.findByIdAndDelete(id);
    console.log("deleted content",deletedlist);
    req.flash("success","Listing deleted successfully!!:(");
    res.redirect("/listings");
}));

module.exports=router;