var express = require('express');
var userRouter = express.Router();
var User = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
userRouter.use(express.json());
/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

userRouter.post('/signup', (req,res,next)=>{
    User.register(new userSchema({username: req.body.username}),req.body.password, (err, user) =>{
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err:err});
      }
      else{
        if(req.body.firstname) user.firstname = req.body.firstname;
        if(req.body.lastname) user.lastname = req.body.lastname;
        user.save((err,user) =>{
          if(err) {
            res.statusCode = 500;
            res.setHeader('Content-Type','application/json');
            res.json({err:err});
            return;
          }   
        });
        passport.authenticate('local')(req,res, ()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({status: 'Registration Successfull', success: true});
        });
      }
    });
});

userRouter.post('/login', passport.authenticate('local'), (req,res) => {
  var token = authenticate.getToken({_id : req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({status: 'Successfully logged in', token: token, success: true});
})

userRouter.get('/logout',(req,res,next) =>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else{
    var err = new Error('You arent even logged in');
    err.status = 403;
    return next(err);
  }
})

module.exports = userRouter;
