const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const { getLogger } = require('nodemailer/lib/shared');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const path = require('path');

const logger = pino({ name: path.basename(__filename), level: process.env.LOG_LEVEL || 'debug', prettyPrint: { colorize: false, translateTime: 'SYS:standard', ignore: 'hostname,pid'}}, pino.destination("./logs/info.log"));



exports.processLogin = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    
    try {
        auth.authenticate(email, function(error, results) {
            if (error) {
                let message = 'Credentials are not valid.';
                //return res.status(500).json({ message: message });
                //If the following statement replaces the above statement
                //to return a JSON response to the client, the SQLMap or
                //any attacker (who relies on the error) will be very happy
                //because they relies a lot on SQL error for designing how to do 
                //attack and anticipate how much "rewards" after the effort.
                //Rewards such as sabotage (seriously damage the data in database), 
                //data theft (grab and sell). 
                return res.status(500).json({ message: error });

            } else {
                if (results.length == 1) {
                    if ((password == null) || (results[0] == null)) {
                        return res.status(500).json({ message: 'login failed' });
                    }
                    if (bcrypt.compareSync(password, results[0].user_password) == true) {
                        
                        let data = {
                            user_id: results[0].user_id,
                            role_name: results[0].role_name,
                            token: jwt.sign({ id: results[0].user_id, role:results[0].role_name }, config.JWTKey, {
                                expiresIn: 86400 //Expires in 24 hrs
                            })
                        }; //End of data variable setup

                        return res.status(200).json(data);
                    } else {
                        // return res.status(500).json({ message: 'Login has failed.' });
                        return res.status(500).json({ message: error });
                    } //End of passowrd comparison with the retrieved decoded password.
                } //End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        return res.status(500).json({ message: error });
    } //end of try



};

exports.processRegister = (req, res, next) => {
    console.log('processRegister running.');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, async(err, hash) => {
            if (err) {
                console.log('Error on hashing password');
                return res.status(500).json({ message: 'Unable to complete registration' });
            } else {
                    results = user.createUser(fullName, email, hash, function(results, error){
                      if (results!=null){
                        console.log(results);
                        logger.info('Account Created')
                        return res.status(200).json({ message: 'Completed registration.' });
                      }
                      if (error.code == 'ER_DUP_ENTRY') {
                          logger.error('Duplicate Email')
                          return res.status(409).json({ message: 'Email already exist' });
                      }
                      if (error) {
                        console.log('processRegister method : callback error block section is running.');
                        console.log(error, '==================================================================');
                        return res.status(500).json({ message: 'Unable to complete registration' });
                    }
                    });//End of anonymous callback function
         
              
            }
        });
    })


}; // End of processRegister