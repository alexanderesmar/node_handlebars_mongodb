const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

router.get('/users/signin', (req, res) => {
    //res.send('ingresando a la app');
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin', 
    failureFlash: true

}));

router.get('/users/signup', (req, res) => {
    //res.send('registro');
    res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {

    const {name, email, password, confirm_password} = req.body;
    const errors = [];

    if (name.length<=0) {
        errors.push({text: 'insert a name'});        
    }

    if (password!=confirm_password) {
        errors.push({text: 'passwords dont match'});
        
    }
    if (password.length<4) {
        errors.push({text: 'password needs at least 4 caracters long'});        
    }

    if (errors.length>0 ) {
        res.render('users/signup', {errors, name, email, password, confirm_password});        
    }else{
        const emailUser = await User.findOne({email: email});

        if (emailUser) {
            req.flash('error_msg', 'the email is already registered');
            res.redirect('/users/signup');
        }else{

            const newUser = new User ({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You are now registered');
            res.redirect('/users/signin');
        }
    }
    //console.log(res.body);
    //res.render('users/signup');
});

router.get('/users/logout', (req, res, next) =>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect("/");
      });
});

module.exports = router;