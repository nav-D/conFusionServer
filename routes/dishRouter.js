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


dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type','application/json');
            res.json(dish.comments);
        }
        else{
            err = new Error('Dish' + req.params.dishId + "doesn't exist");
            err.status = 404;
            return next(err);
        }
    }, (err) =>{next(err)})
    .catch((err) => next(err));
})

.post((req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err) => next(err))
            .catch((err) => next(err));
        } 
        else{
            err = new Error('Dish' + req.params.dishId + "doesn't exist");
            err.status = 404;
            return next(err);
        }
    }, (err) => {next(err)})
    .catch((err) => next(err));   
})

.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /dishes'+req.params.dishId+'/comments');
})

.delete((req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null) {
            for( var i=0; i<dish.comments.length; i++) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                
                res.setHeader('Content-Type','application/json');
                res.json(dish);
            },(err) => next(err))
            .catch((err) => next(err));
        } 
        else{
            err = new Error('Dish' + req.params.dishId + "doesn't exist");
            err.status = 404;
            return next(err);
        }
    }, (err) => {next(err)})
    .catch((err) => next(err));
});


dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish !=null ){
            var comment = dish.comments.id(req.params.commentId)

            if(comment != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type','application/json');
                res.json(comment);
            }
            else throw err = new Error('Comment '+req.params.commentId +' doesnt exist');
        }
        else{
            err = new Error('Dish' + req.params.dishId + "doesn't exist");
            err.status = 404;
            return next(err);
        }
    }, (err) =>{next(err)})
    .catch((err) => next(err));
})

.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('POST not supported for /dishes/'+ req.params.dishId);    
})

.put((req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish !=null ){
            var comm = dish.comments.id(req.params.commentId)

            if(comm != null) {
                if(req.body.rating) {
                    comm.rating = req.body.rating;
                }
                if(req.body.comment) {
                    comm.comment = req.body.comment;
                }
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish.comments);
                }, (err) => next(err));
            }
            else { 
                err = new Error('Comment '+req.params.commentId +' doesnt exist');
                err.status =404 ;
                throw err;
            }
        }
        else{
            err = new Error('Dish' + req.params.dishId + "doesn't exist");
            err.status = 404;
            return next(err);
        }
    }, (err) =>{next(err)})
    .catch((err) => next(err));
})

.delete((req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish !=null ){
            var comm = dish.comments.id(req.params.commentId)

            if(comm != null) {
                // dish.comments.id(req.params.commentId).remove();
                comm.remove();
                dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type','application/json');
                    res.json(dish.comments);
                }, (err) => next(err));
            }
            else { 
                err = new Error('Comment '+req.params.commentId +' doesnt exist');
                err.status =404 ;
                throw err;
            }
        }
        else{
            err = new Error('Dish' + req.params.dishId + "doesn't exist");
            err.status = 404;
            return next(err);
        }
    }, (err) =>{next(err)})
    .catch((err) => next(err));
});



module.exports = dishRouter;