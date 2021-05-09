const express = require('express');

const leaderRouter = express.Router();

leaderRouter.use(express.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Leaders'+'\n');
    next();
})
.get((req,res,next) => {
    res.end("Will send all the leaders' list to you");
})
.post((req,res,next) =>{
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /leaders');
})
.delete((req,res,next) =>{
    res.end('deleting all leaders');
});


leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Leader' +'\n')
    next();
})
.get((req,res,next) => {
    res.end('Will send the details of leader: '
        + req.params.leaderId );
})

.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('POST not supported for /leader/'+ req.params.leaderId);    
})

.put((req,res,next) =>{
    res.write('Updating the leader: ' + req.params.leaderId + '\n')
    res.end('Will update the leader: '+  req.body.name + ' with details: '+ req.body.description);
})

.delete((req,res,next) =>{
    res.end('deleting the leader: '+req.params.leaderId);
});



module.exports = leaderRouter;