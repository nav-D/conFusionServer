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
                    console.log("The dish " + req.body[i] + " is already in your favorites");
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
                        console.log("The dish " + req.body[i] + " is already in your favorites");
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
            .catch((err) => next(err));
        }

    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("Put operation not supported on /favorite end point");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOneAndDelete({user: req.user._id})
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type","application/json");
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus = 200;})
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end("Put operation not supported on /favorite end point");
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite != null){
            if(!favorite.dishes.includes(req.params.dishId)) favorite.dishes.push(req.params.dishId);
            else{
                var err = new Error("This dish is already in your favorites");
                next(err);
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
            Favorites.create({user: req.user._id, dishes:[]})
            .then((favorite) => {
                favorite.dishes.push(req.params.dishId);
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 402;
    res.end("Put operations not supported on a particular dish");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite) => {
        if(favorite != null){
            var index = favorite.dishes.indexOf(req.params.dishId);
            if(index > -1) favorite.dishes.splice(index,1);
            else{
                var err = new Error("This dish is not in your favorites");
                next(err);
            }
            if(favorite.dishes.length === 0){
                Favorites.findOneAndDelete({user: req.user._id})
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type","application/json");
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
            else{
                favorite.save()
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(favorite);
                }, (err) => next(err))
                .catch((err) => next(err));
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;