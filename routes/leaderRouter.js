var express = require('express');
var mongoose = require('mongoose');
var authenticate = require('../authenticate');
var Leaders = require('../models/leaders');
var cors = require('./cors');

const leaderRouter = express.Router();

leaderRouter.use(express.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, (req,res,next) => {
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
.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) =>{
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
.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /leaders');
})
.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) =>{
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
.options(cors.corsWithOptions, (req,res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, (req,res,next) => {
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

.post(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) =>{
    res.statusCode = 403;
    res.end('POST not supported for /leader/'+ req.params.leaderId);    
})

.put(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) =>{
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

.delete(cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin ,(req,res,next) =>{
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