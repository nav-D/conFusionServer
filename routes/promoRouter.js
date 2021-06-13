var express = require('express');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var cors = require('./cors');
var Promotions = require('../models/promotions');

const promoRouter = express.Router();

promoRouter.use(express.json());

promoRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, (req,res,next) => {
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
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) =>{
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
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin ,(req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin ,(req,res,next) =>{
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
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, (req,res,next) => {
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

.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin ,(req,res,next) =>{
    res.statusCode = 403;
    res.end('POST not supported for /promos/'+ req.params.promoId);    
})

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin ,(req,res,next) =>{
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

.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin ,(req,res,next) =>{
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