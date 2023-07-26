const User = require('../models/user');

//redering the signin page
module.exports.signIn = function(req, res){
    return res.render('sign_in',{
        title: 'ERS'
    });
}

//creating the session, basically for logging in
module.exports.createSession = async function(req, res){
    req.flash('success', 'You are logged In');
    return res.redirect('/');
}

//This function is used for rendering the signUp page
module.exports.signUp = function(req, res){
    return res.render('sign_up', {
        title:'ERS'
    });
}

//function to create the new user
module.exports.create = async function(req, res){
    if(req.body.password != req.body.confirmPassword){
        //disply flash message
        req.flesh('error', 'Password should be equal to confirm password');
        return res.redirect('back');
    }
    let user = await User.findOne({email : req.body.email});
    if(!user){
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            isAdmin: false
        });
        return res.redirect('/users/sign-in');
    }
    return res.redirect('back');
}

//This function is used for logging out
module.exports.destroySession = async function(req, res, done) {
    req.logout((err) => {
        if (err) {
            return done(err);
        }
    });
    req.flash('success' , 'You are logged out!');
    return res.redirect('/users/sign-in');
}

//forget password pagfe
module.exports.forgetPasswordPage = function(req, res){
    return res.render('forget_password',{
        title: 'Forget Password'
    });
}

// this will update the existing password, with the newly created password.
module.exports.forgetPasswordLink = async function(req, res){
    let user = await User.findOne({ email: req.body.email });
    //console.log(user);
    //console.log(req.body);
    if(!user){
        return res.redirect('/users/signUp');
    }
    if(req.body.password == req.body.confirmPassword){
        req.flash('success' , 'Password Changed :)');
        user.password = req.body.password;
        await user.updateOne({password : req.body.password});
        return res.redirect('/users/sign-in');
    }
    return res.redirect('back');

}

// Adding employe, it is same as signUp , but it will redirect you to the addEmplyee page
module.exports.addEmployeee = async function(req, res){
    if(req.body.password != req.body.confirmPassword){
        //disply flash messages
        req.flash('error' , 'Password should be equal to Confirm Password');
        return res.redirect('back');
    }
    let user = await User.findOne({email : req.body.email});
    if(!user){
        await User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password,
            isAdmin : false
        });
        
        return res.redirect('/admin/view-employee');
    }
    return res.redirect('back');
}

//This function is used for making the new admin
module.exports.makeAdmin = async function(req, res){
    try{
        if(req.body.admin_password == 'admin123'){
            let user = await User.findById(req.user.id);
            user.isAdmin = true;
            user.save();
            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(error){
        console.log('Error', error);
        return;
    }
}
