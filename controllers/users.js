const User=require("../models/user");

module.exports.signUpForm=(req, res) => {
    res.render("./users/signup");
};

//create user via signup form 
module.exports.registerUser=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

//login form
module.exports.loginForm= (req, res) => {
    res.render("./users/login");
};

//post the login form details router
module.exports.loginUser=async (req, res) => {
    let { username, password } = req.body;
    req.flash("success","Login successfull welcome back <3");
    let redirectUrl=res.locals.redirectUrl||"/listings";//if we are logging in directly form login page then no redirecturl is present so /lisitings;
    res.redirect(redirectUrl);
};

//logout user
module.exports.logoutUser=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!!");
        res.redirect("/listings");
    });
};