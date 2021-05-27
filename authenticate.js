var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey);
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use( new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log('JWT Payload', jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err,user) => {
            if(err) return done(err, false);
            else if(user) return done(null,user);
            else return done(null,false); 
        });
    }));
 
exports.verifyUser = passport.authenticate('jwt',{session: false});

//  exports.verifyAdmin = (user) => {
//     if(!user.admin) {
//         var err = new Error('You are not authorized for this operation');
//         err.status = 403;
//         return err;
//     }
//     else return user;
//  };