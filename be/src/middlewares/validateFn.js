const validator = require('validator');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const path = require('path');

const logger = pino({ name: path.basename(__filename), level: process.env.LOG_LEVEL || 'debug', prettyPrint: { colorize: false, translateTime: 'SYS:standard', ignore: 'hostname,pid'}}, pino.destination("./logs/info.log"));

const validationFn = {

    validateUpdateSubmission: function (req, res, next) {

        logger.info("validateUpdateSubmission middleware called");
        const fileId = req.body.fileId;
        const designTitleInput = req.body.designTitle;
        const designDescriptionInput = req.body.designDescription;

        reDesignTitleInput = new RegExp(`^[\\w\\s]+$`);
        reDesignDescriptionInput = new RegExp(`^[\\w\\s\\.]+$`);
        reFileId = new RegExp(`^\\d+$`);

        if (reDesignTitleInput.test(designTitleInput) && reDesignDescriptionInput.test(designDescriptionInput) && reFileId.test(fileId)) {
            next();
        } else {
            logger.error("Error while submitting, most likely validation error");
            res.status(500);
            res.send(`{"message":"Validation Error"}`);
        }
    },

    validateSubmitDesign: function (req, res, next) {
        logger.info("validateSubmitDesign middleware called");
        const designTitleInput = req.body.designTitle;
        const designDescriptionInput = req.body.designDescription;

        reDesignTitleInput = new RegExp(`^[\\w\\s]+$`);
        reDesignDescriptionInput = new RegExp(`^[\\w\\s\\.]+$`);

        if (reDesignTitleInput.test(designTitleInput) && reDesignDescriptionInput.test(designDescriptionInput)) {
            next();
        } else {
            logger.error("Error while submitting, most likely validation error");
            res.status(500);
            res.send(`{"message":"Validation Error"}`);
        }
    },

    validateSearchTitle: function (req, res, next) {
        logger.info("validateSearchTitle middleware called");
        const search = req.params.search;
        const inviteName = req.body.recipientName;
        reSearch = new RegExp(`^[\\w\\s]+$`);

        if (reSearch.test(search || inviteName)) {
            next();
        } else {
            logger.error("Error while searching for design titles, most likely validation error");
            res.status(500);
            res.send(`{"message":"Validation Error"}`);
        }
    },

    validateEmail: function (req, res, next) {
       logger.info("validateEmail middleware called");
        var email = req.params.search;
        if (email != null || req.body.email != null && req.body.email != "" || req.body.recipientEmail != null && req.body.recipientEmail != "") {
            if (validator.isEmail(email || req.body.email || req.body.recipientEmail)) {
                logger.info('passed')
                next();
            } else {
                logger.error("user input is not an email")
                res.status(500);
                res.send(`{"message":"Please enter a VALID email"}`);
            }
        } else {
            res.status(500);
            logger.error("Empty Email Input Box")
            res.send(`{"message":"Please enter an Email"}`);
        }
    },

    validatePassword: function (req, res, next) {
        logger.info("validatePassword middleware called");
        const password = req.body.password;

        rePassword = new RegExp(/^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/);

        if (rePassword.test(password)) {
            next();
        } else {
            logger.error("Password requirement not met");
            res.status(500);
            res.send(`{"message":"Password requirement not met"}`);
        }
    },
 



} //end validationFn


module.exports = validationFn;