const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm= async(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    //also pupulate each review author -> we use nested review
    const listing=await Listing.findById(id)
    .populate({path:"reviews",
        populate:{
            path:"author",
        },
    })
    .populate("owner");
    if(!listing){
        req.flash("error","The requested listing does not exists :(");
        return res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
};

module.exports.createNewListing=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    console.log(newListing);
    await newListing.save();
    req.flash("success","New Listing created successfully !!<3");
    res.redirect("/listings");
};

module.exports.editListingForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing does not exist :(");
        return res.redirect("./listings");
    }
    res.render("./listings/edit.ejs",{listing});
};

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    const updatedlist=req.body.listing;
    await Listing.findByIdAndUpdate(id,updatedlist,{ new: true, runValidators: true });
    console.log("updated content",updatedlist);
    req.flash("success","Listing updated successfully :)");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    const deletedlist=await Listing.findByIdAndDelete(id);
    console.log("deleted content",deletedlist);
    req.flash("success","Listing deleted successfully!!:(");
    res.redirect("/listings");
};

