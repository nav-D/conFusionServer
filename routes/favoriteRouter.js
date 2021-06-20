var express = require('express');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var Favorites = require('../models/favorites');
var cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(express.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus = 200;})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite);

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite != null){
            for(i=0; i<req.body.length; i++){
                if(!favorite.dishes.includes(req.body[i])) favorite.dishes.push(req.body[i]);
                else {
                    res.json('This dish is already your favorite');
                }
            }
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else{
            Favorites.create({user: req.user._id, dishes: []})
            .then((favorite) => {
                for(i=0 ; i<req.body.length; i++){
                    if(!favorite.dishes.includes(req.body[i])) favorite.dishes.push(req.body[i]);
                    else {
                        res.json('This dish is already your favorite');
                    }
                }
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            },(err) => next(err))
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;