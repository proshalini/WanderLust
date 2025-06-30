if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
};
const express=require("express");
const app=express();
exports.app=app;
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const methodOverride=require("method-override");
const path = require("path"); // Add this at the top of your file
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingsRouter=require("./routes/listings.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.use(methodOverride('_method'));
app.set("views",path.join(__dirname,"/views"));
app.set("view engine",'ejs');
app.use(express.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

main()
.then(()=>{console.log("connected to database")})
.catch(err=>{console.log(err)});
async function main(){
    await mongoose.connect(mongo_url);
}

app.get("/",(req,res)=>{
    res.send("root working");
})
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// to authenticate 

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

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


