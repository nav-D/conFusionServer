const express = require('express');
var mongoose = require('mongoose'); 

var Dishes = require('../models/dishes');

const dishRouter = express.Router();

dishRouter.use(express.json());

dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, (err) =>{next(err)})
    .catch((err) => next(err));
})
.post((req,res,next) =>{
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Created: ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /dishes');
})
.delete((req,res,next) =>{
    Dishes.deleteMany()
    .then((response) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, (err) =>{next(err)})
    .catch((err) => next(err));
})

.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('POST not supported for /dishes/'+ req.params.dishId);    
})

.put((req,res,next) =>{
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new:true})
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, (err) =>{next(err)})
    .catch((err) => next(err));
})

.delete((req,res,next) =>{
    Dishes.findByIdAndDelete(req.params.dishId)
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    }, (err) =>{next(err)})
    .catch((err) => next(err));
});



module.exports = dishRouter;