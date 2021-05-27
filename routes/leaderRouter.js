var express = require('express');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var Leaders = require('../models/leaders');

const leaderRouter = express.Router();

leaderRouter.use(express.json());

leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({})
    .then((leaders)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    }
     ,(err) => next(err)
    )
    .catch((err) => next(err));
})
.post(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    Leaders.create(req.body)
    .then((leader)=> {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    }
     ,(err) => next(err)
    )
    .catch((err) => next(err));
})
.put(authenticate.verifyUser ,(req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /leaders');
})
.delete(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    Leaders.deleteMany()
    .then((response) => {
        res.statusCode= 200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    }
     ,(err) => next(err))
    .catch((err) => next(err));
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    }
     ,(err) => next(err)
    )
    .catch((err) => next(err));
})

.post(authenticate.verifyUser ,(req,res,next) =>{
    res.statusCode = 403;
    res.end('POST not supported for /leader/'+ req.params.leaderId);    
})

.put(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    Leaders.findByIdAndUpdate(req.params.leaderId,{
        $set: req.body
    },{new: true})
    .then((leaders) =>{
        res.statusCode= 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    }
     ,(err) => next(err)
    )
    .catch((err) =>next(err));
})

.delete(authenticate.verifyUser ,(req,res,next) =>{
    if(!req.user.admin) {
        var err = new Error('You are not authorized for this operation');
        throw err;
    }
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    }
    ,(err) => next(err)
    )
    .catch((err) => next(err));
});

module.exports = leaderRouter;