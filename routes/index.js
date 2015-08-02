'use strict';
var express = require('express');
var router = express.Router();
var Teacher = require('../models/teacherSchema');
var Question = require('../models/questionSchema');
var passport = require('passport');


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user)
  res.render('index', { user: req.user });
});


// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
router.get('/auth/google',
  passport.authenticate('google',  { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email' ] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



module.exports = router;
