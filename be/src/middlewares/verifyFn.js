const config = require('../config/config');
const jwt = require('jsonwebtoken');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const path = require('path');

const logger = pino({ name: path.basename(__filename), level: process.env.LOG_LEVEL || 'debug', prettyPrint: { colorize: false, translateTime: 'SYS:standard', ignore: 'hostname,pid'}}, pino.destination("./logs/info.log"));

const verifyFn = {

    verifyTokenUserID:  function (req, res, next) {
        logger.error("gg");
         logger.info("verifyTokenUserID middleware called");
        let token = req.headers['authorization'];
        res.type('json');
        if (!token || !token.includes("Bearer ") || token.split(' ').pop() == 'null') {
           logger.error("Unauthorized Access Attempt Was Made, No Token")
            res.status(403);
            res.send(`{"message":"Not Authorized"}`);
        } else {
            token = token.split('Bearer ')[1];
            jwt.verify(token,config.JWTKey,function(err,decoded){
                if(err){
                    logger.error("Unauthorized Access Attempt Was Made, Invalid Token")
                    res.status(403);
                    res.send(`{"message":"Not Authorized"}`);
                }else{
                    req.body.userId = decoded.id;
                    req.role = decoded.role;
                    next();
                }
            });
        }
    }

}

module.exports = verifyFn;