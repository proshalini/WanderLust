const express=require("express");
const app=express();
exports.app=app;
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride=require("method-override");
const path = require("path"); // Add this at the top of your file
const ExpressError=require("./utils/ExpressError.js");

const listings=require("./routes/listings.js");
const reviews=require("./routes/review.js");

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

app.get("/",(req,res)=>{
    res.send("root working");
})
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


app.use((req,res,next)=>{
    console.log("new error catched");
    next(new ExpressError(404,"Page not found"));
});


app.use((err, req, res, next) => {
    console.log(err);
    // Log full error stack
    let { status = 500, message = "An error occurred" } = err;
    res.status(status).render("./listings/error",{message});
});

app.listen(8080,()=>{
    console.log("app is listening at port 8080");
})


