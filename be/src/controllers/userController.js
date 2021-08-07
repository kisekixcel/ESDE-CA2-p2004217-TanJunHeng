const userManager = require('../services/userService');
const fileDataManager = require('../services/fileService');
const config = require('../config/config');
const validateFn = require('../middlewares/validateFn');
const pino = require('pino');
const expressPino = require('express-pino-logger');
const path = require('path');

const logger = pino({ name: path.basename(__filename), level: process.env.LOG_LEVEL || 'debug', prettyPrint: { colorize: false, translateTime: 'SYS:standard', ignore: 'hostname,pid'}}, pino.destination("./logs/info.log"));

// 
exports.processDesignSubmission = async(req, res, next) => {
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userId = req.body.userId;
    let file = req.body.file;
    fileDataManager.uploadFile(file, async function(error, result) {
        try {
            let uploadResult = result;
                //Update the file table inside the MySQL when the file image
                //has been saved at the cloud storage (Cloudinary)
                let imageURL = uploadResult.imageURL;
                let publicId = uploadResult.publicId;
                console.log('check uploadResult before calling createFileData in try block', uploadResult);
                try {
                    let result = await fileDataManager.createFileData(imageURL, publicId, userId, designTitle, designDescription);
                    console.log('Inspect result variable inside fileDataManager.uploadFile code\n', result);
                    if (result) {
                        let message = 'File submission completed.';
                        res.status(200).json({ message: message, imageURL: imageURL });
                    }
                } catch (error) {
                    let message = 'File submission failed.';
                    res.status(500).json({ message: message });
                }
        } catch (error) {
            logger.error('check error variable in fileDataManager.upload code block\n'+ error);
            let message = 'File type is not an image.';
            res.status(500).json({ message: message });
        }
    })

}; //End of processDesignSubmission

exports.processGetSubmissionData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;
    try {
        let results = await fileDataManager.getFileData(userId, pageNumber, search);
        console.log('Inspect result variable inside processGetSubmissionData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'filedata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).json({
            message: message
        });
    }

}; //End of processGetSubmissionData
exports.processGetSubmissionsbyEmail = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;
    let userId = req.body.userId;
    try {
        //Need to search and get the id information from the database
        //first. The getOneuserData method accepts the userId to do the search.
        let userData = await userManager.getOneUserDataByEmail(search);
        logger.info('Results in userData after calling getOneUserDataByEmail');
        console.log(userData)
        if (userData){       
        let results = await fileDataManager.getFileDataByUserId(userData[0].user_id, pageNumber);
        console.log('Inspect result variable inside processGetSubmissionsbyEmail code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'filedata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }//Check if there is any submission record found inside the file table
    }//Check if there is any matching user record after searching by email
    } catch (error) {
        if (error.user_id == undefined) {
            logger.error("User not found")
             message = 'User not found'
        } else {
             message = 'Server is unable to process your request.';
        }
        return res.status(500).json({ message: message });

    }

}; //End of processGetSubmissionsbyEmail

exports.processGetUserData = async(req, res, next) => {
    let pageNumber = req.params.pagenumber;
    let search = req.params.search;

    try {
        let results = await userManager.getUserData(pageNumber, search);
        console.log('Inspect result variable inside processGetUserData code\n', results);
        if (results) {
            var jsonResult = {
                'number_of_records': results[0].length,
                'page_number': pageNumber,
                'userdata': results[0],
                'total_number_of_records': results[2][0].total_records
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable to process your request.';
        return res.status(500).json({
            message: message
        });
    }

}; //End of processGetUserData

exports.processGetOneUserData = async(req, res, next) => {
    let recordId = req.params.recordId;
    let getType = req.params.getType;
    let userId = req.body.userId

    if (getType == "profileType") {
        try {
            logger.debug("getType is " + getType)
            let results = await userManager.getOneUserData(userId);
            console.log('Inspect result variable inside processGetOneUserData code\n', results);
            if (results) {
                var jsonResult = {
                    'userdata': results[0],
                }
                return res.status(200).json(jsonResult);
            }
        } catch (error) {
            let message = 'Server is unable to retrieve Profile Data request.';
            return res.status(500).json({
                message: message
            });
        }
    } else {
        try {
            logger.debug("getType is " + getType)
            let results = await userManager.getOneUserData(recordId);
            console.log('Inspect result variable inside processGetOneUserData code\n', results);
            if (results) {
                var jsonResult = {
                    'userdata': results[0],
                }
                return res.status(200).json(jsonResult);
            }
        } catch (error) {
            let message = 'Server is unable to retrieve User Data request.';
            return res.status(500).json({
                message: message
            });
        }
    }


}; //End of processGetOneUserData


exports.processUpdateOneUser = async(req, res, next) => {
    logger.info('processUpdateOneUser running');
    //Collect data from the request body 
    let recordId = req.body.recordId;
    let newRoleId = req.body.roleId;
    try {
        results = await userManager.updateUser(recordId, newRoleId);
        console.log(results);
        return res.status(200).json({ message: 'Completed update' });
    } catch (error) {
        logger.info('processUpdateOneUser method : catch block section code is running');
        console.log(error, '=======================================================================');
        return res.status(500).json({ message: 'Unable to complete update operation' });
    }


}; //End of processUpdateOneUser

exports.processGetOneDesignData = async(req, res, next) => {
    let recordId = req.params.fileId;
    let userId = req.body.userId

    try {
        let results = await userManager.getOneDesignData(recordId, userId);
        console.log('Inspect result variable inside processGetOneFileData code\n', results);
        if (results) {
            var jsonResult = {
                'filedata': results[0],
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        let message = 'Server is unable retrieve file Data.';
        return res.status(500).json({
            message: message
        });
    }

}; //End of processGetOneDesignData

exports.processSendInvitation = async(req, res, next) => {
    
    let userId = req.body.userId;
    let recipientEmail = req.body.recipientEmail;
    let recipientName = req.body.recipientName;
    logger.info('userController processSendInvitation method\'s received values');
    console.log(userId);
    console.log(recipientEmail);
    console.log(recipientName);
    try {
        //Need to search and get the user's email information from the database
        //first. The getOneuserData method accepts the userId to do the search.
        let userData = await userManager.getOneUserData(userId);

        let results = await userManager.createOneEmailInvitation(userData[0],recipientName, recipientEmail);
        if (results) {
            var jsonResult = {
                result: 'Email invitation has been sent to ' + recipientEmail + ' ',
            }
            return res.status(200).json(jsonResult);
        }
    } catch (error) {
        logger.error(error);
        let message = 'Server is unable to process the request.';
        return res.status(500).json({
            message: message,
            error:error
        });
    }

}; //End of processSendInvitation



exports.processUpdateOneDesign = async(req, res, next) => {
    logger.info('processUpdateOneFile running');
    //Collect data from the request body 
    let fileId = req.body.fileId;
    let designTitle = req.body.designTitle;
    let designDescription = req.body.designDescription;
    let userid = req.body.userId
    try {
        results = await userManager.updateDesign(fileId, designTitle, designDescription, userid);
        console.log(results);
        let message = 'Completed update'
        logger.info(message)
        return res.status(200).json({ message: message });
    } catch (error) {
        logger.info('processUpdateOneDesign method : catch block section code is running');
        console.log(error, '=======================================================================');
        let message = 'Unable to complete update operation'
        logger.error(message)
        return res.status(500).json({ message: message });
    }

}; //End of processUpdateOneDesign