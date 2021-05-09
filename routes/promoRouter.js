const express = require('express');

const promoRouter = express.Router();

promoRouter.use(express.json());

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Promos'+'\n');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promotions to you');
})
.post((req,res,next) =>{
    res.end('Will add the Promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put((req,res,next) =>{
    res.statusCode = 403;
    res.end('PUT not supported on /promotions');
})
.delete((req,res,next) =>{
    res.end('deleting all promotions');
});


promoRouter.route('/:promoId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Promo' +'\n')
    next();
})
.get((req,res,next) => {
    res.end('Will send the details of promo: '
        + req.params.promoId );
})

.post((req,res,next) =>{
    res.statusCode = 403;
    res.end('POST not supported for /promo/'+ req.params.promoId);    
})

.put((req,res,next) =>{
    res.write('Updating the promo: ' + req.params.promoId + '\n')
    res.end('Will update the promo: '+  req.body.name + ' with details: '+ req.body.description);
})

.delete((req,res,next) =>{
    res.end('deleting the promo: '+req.params.promoId);
});



module.exports = promoRouter;