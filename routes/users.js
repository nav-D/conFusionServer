var express = require('express');
var userRouter = express.Router();
var userSchema = require('../models/users');
var passport = require('passport');
userRouter.use(express.json());
/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

userRouter.post('/signup', (req,res,next)=>{
    userSchema.register(new userSchema({username: req.body.username}),req.body.password, (err, user) =>{
      if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type','application/json');
        res.json({err:err});
      }
      else{
        passport.authenticate('local')(req,res, ()=>{
          res.statusCode = 200;
          res.setHeader('Content-Type','application/json');
          res.json({status: 'Registration Successfull', success: true});
        });
      }
    });
});

userRouter.post('/login', passport.authenticate('local'), (req,res,next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type','application/json');
  res.json({status: 'Successfully logged in', success: true});

  // if(!req.session.user) {
  //   var authHeader = req.headers.authorization;
  //   if(!authHeader) {
  //     var err = new Error('You are not authorized');
  //     res.setHeader('WWW-Authenticate', 'Basic');
  //     err.status = 401
  //     return next(err);
  //   }
    
  //   var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  //   var username = auth[0];
  //   var password = auth[1];

  //   userSchema.findOne({username: username})
  //   .then((user) => {
  //     if(user == null) {
  //       var err = new Error('User '+ username +" doesn't exist");
  //       err.status = 403;
  //       next(err);
  //     }
  //     else if(user.password != password){
  //       var err = new Error('Incorrect Password');
  //       err.status = 403;
  //       next(err);
  //     }
  //     else {
  //       req.session.user = 'authenticated';
  //       res.statusCode = 200;
  //       res.setHeader('Content-Type','text/plain');
  //       res.end('You are authorised!');
  //     }
  //   })
  //   .catch((err) => next(err));
  // }
  // else{
  //   res.statusCode =200;
  //   res.setHeader('Content-Type','text/plain');
  //   res.end('You are already authorised');
  // }
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
