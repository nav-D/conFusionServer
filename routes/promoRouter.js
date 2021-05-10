var express = require('express');
var mongoose = require('mongoose');

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
.post((req,res,next) =>{
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
.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /promotions');
})
.delete((req,res,next) =>{
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

.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('POST not supported for /promos/'+ req.params.promoId);    
})

.put((req,res,next) =>{
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

.delete((req,res,next) =>{
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