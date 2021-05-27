var express = require('express');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');

var Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(express.json());

promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((promos)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promos);
    }
    // ,(err) => next(err)
    )
    .catch((err) => next(err));
})
.post(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    Promotions.create(req.body)
    .then((promo)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    }
    // ,(err) => next(err)
    )
    .catch((err) => next(err));
})
.put(authenticate.verifyUser ,(req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /promotions');
})
.delete(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    Promotions.deleteMany()
    .then((response) => {
        res.statusCode= 200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    }
    // ,(err) => next(err))
    )
    .catch((err) => next(err));
});


promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then((promo) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    }
    // ,(err) => next(err)
    )
    .catch((err) => next(err));
})

.post(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    res.statusCode = 403;
    res.end('POST not supported for /promos/'+ req.params.promoId);    
})

.put(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    Promotions.findByIdAndUpdate(req.params.promoId,{
        $set: req.body
    },{new: true})
    .then((promos) =>{
        res.statusCode= 200;
        res.setHeader('Content-Type','application/json');
        res.json(promos);
    }
    // ,(err) => next(err)
    )
    .catch((err) =>next(err));
})

.delete(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    Promotions.findByIdAndRemove(req.params.promoId)
    .then((promos) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(promos);
    }
    // ,(err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = promoRouter; 