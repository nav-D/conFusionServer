var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userSchema = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

passport.use(new LocalStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());

exports.getToken = (user) => {
    return jwt.sign(user, config.secretKey);
}

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use( new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log('JWT Payload', jwt_payload);
        userSchema.findOne({_id: jwt_payload._id}, (err,user) => {
            if(err) return done(err, false);
            else if(user) return done(null,user);
            else return done(null,false); 
        });
    }));
 
exports.verifyUser = passport.authenticate('jwt',{session: false});