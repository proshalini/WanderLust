const express=require("express");
const app=express();
const  cookieParser = require('cookie-parser')
const path = require("path"); 

app.use(express.urlencoded({ extended: true }));
app.set("view engine",'ejs');
app.use(cookieParser("secretcode"));
app.set("views",path.join(__dirname,"/views"));

app.get("/cookie",(req,res)=>{
    res.send("Cookie saved successfully");
})
app.get("/",(req,res)=>{
    res.render("form");
});

app.post("/",(req,res)=>{
    let name=req.body.name;
    res.cookie("user",name,{signed:true});
    res.redirect("/cookie");
})

app.get("/newcookie",(req,res)=>{
    let {user} =req.signedCookies;
    console.log(user)
    if(user==null || user==false){
        res.send("the cookie was altered");
  
    }
     res.send(`welcome ${user} to the newcookie page we remember you`);
    
    
})

app.get("/new",(req,res)=>{
    let {user="anonymous"}=req.cookies;
    res.send(`We remember you ${user}`);
})

app.get("/random",(req,res)=>{
    res.send(`anywhere you go we remember you ${req.cookies.user}`);
})
app.listen(3000,(req,res)=>{
    console.log("app listenig on port 3000");
})

