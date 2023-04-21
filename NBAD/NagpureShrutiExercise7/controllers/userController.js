const User = require('../models/user');



exports.new = (req, res)=>{
    res.render('./user/new');
};

exports.create = (req,res, next)=>{
    let user=new User(req.body);
    user.save()
    .then(()=>res.redirect('/login'))
    .catch(err=>{
        if(err.name==='ValidationError'){
            req.flash('error',err.message);
            return res.redirect('/new');
        }
        if(err.code===11000){
            req.flash('error','email address has been used');
            return res.redirect('/new');
        }
        next(err);
    });
    

}

exports.login = (req, res)=>{
    res.render('./user/login');
};

//process login request
exports.loginProcess= (req,res, next)=>{
    //authenticate user's login request
    let email=req.body.email;
    let password=req.body.password;
    

    //get the user that matches the emaail
    User.findOne({email})
    .then(user=>{
        if(user){
            //user found in the database
            user.comparePassword(password)
            .then(result=>{
                //console.log(result);
                if(result){
                    req.session.user=user._id;
                    req.flash('success', 'you have successfully logged in');
                    res.redirect('/users/profile');
                }
                else{
                    //console.log('wrong password');
                    req.flash('error', 'Wrong Password!');
                    res.redirect('/users/login');
                }

            })
            
           
        }
        else{
            //console.log('wrong email address');
            req.flash('error', 'Wrong email address!');
            res.redirect('/login');
        }
    })
    .catch(err=>next(err));
    
};

//get profile
exports.profile=(req,res,next)=>{
    let id=req.session.user;
    console.log(req.flash());
    User.findById(id)
    .then(user=>res.render('./user/profile',{user}))
    .catch(err=>next(err))
    
};

//logout
exports.logout=(req,res)=>{
    req.session.destroy(err=>{
        if(err)
           return next(err);
        else
           res.redirect('/');
    });
};




