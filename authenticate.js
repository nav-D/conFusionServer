var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var userSchema = require('./models/users');

passport.use(new LocalStrategy(userSchema.authenticate()));
passport.serializeUser(userSchema.serializeUser());
passport.deserializeUser(userSchema.deserializeUser());
