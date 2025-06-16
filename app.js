const express=require("express");
const app=express();
exports.app=app;
const mongoose=require("mongoose");
const Listing=require("./models/listing");
const ejsMate=require("ejs-mate");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride=require("method-override");
const path = require("path"); // Add this at the top of your file
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const listingSchema=require("./schema.js");

app.use(methodOverride('_method'));
app.set("views",path.join(__dirname,"/views"));
app.set("view engine",'ejs');
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
main()
.then(()=>{console.log("connected to database")})
.catch(err=>{console.log(err)});
async function main(){
    await mongoose.connect(mongo_url);
}

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
}
app.get("/",(req,res)=>{
    res.send("root working");
})

app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}));
//new route
app.get("/listings/new",wrapAsync(async (req,res)=>{
    res.render("./listings/new.ejs");
}));
//index route
app.get("/listings/:id" ,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/show.ejs",{listing});
}));
//create route
app.post("/listings",validateListing,wrapAsync(async (req, res) => {
    let newListing=new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
}));

//edit and update route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("./listings/edit.ejs",{listing});
}));

app.patch("/listings/:id",validateListing,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const updatedlist=req.body.listing;
    await Listing.findByIdAndUpdate(id,updatedlist,{ new: true, runValidators: true });
    console.log("updated content",updatedlist);
    res.redirect("/listings");
}));

//delete route
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const deletedlist=await Listing.findByIdAndDelete(id);
    console.log("deleted content",deletedlist);
    res.redirect("/listings");
}));

app.use((req,res,next)=>{
    console.log("new error catched");
    next(new ExpressError(404,"Page not found"));
});


app.use((err, req, res, next) => {
    // Log full error stack
    let { status = 500, message = "An error occurred" } = err;
    res.status(status).render("./listings/error",{message});
});

app.listen(8080,()=>{
    console.log("app is listening at port 8080");
})


