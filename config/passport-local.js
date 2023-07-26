const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

//authentication using passport
passport.use(new LocalStrategy({
    usernameField: 'email'
},
async function(email, password, done){
    //finding a user and establish the identity
    let user = await User.findOne({email : email});

    if(!user || user.password != password){
        console.log('Invalid Password');
        return done(null, false);
    }
    return done(null, user);
}
));

//serilizing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

//deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done){

    let userId = await User.findById(id);
    if(!userId){
        console.log("Error in config/ passport-local");
        return;
    }
    return done(null, userId);
});

// checking authentication
passport.checkAuthentication = function(req, res, next){
    //if user signed in, then pass on the request to the next function
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not signed in
    return res.redirect('/users/sign-in');
}

//Setting authentication
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        //current user data is stored in the req, so we jest store its data to res
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;