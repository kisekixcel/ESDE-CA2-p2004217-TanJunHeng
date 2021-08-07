// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const checkUserRoleFn = require('./middlewares/checkUserRoleFn');
const validateFn = require('./middlewares/validateFn');
const verifyFn = require('./middlewares/verifyFn');

// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', validateFn.validateEmail ,authController.processLogin);
    router.post('/api/user/register',validateFn.validatePassword, validateFn.validateEmail,  authController.processRegister);
    router.post('/api/user/process-submission', verifyFn.verifyTokenUserID, validateFn.validateSubmitDesign, userController.processDesignSubmission);
    router.put('/api/user/', verifyFn.verifyTokenUserID, checkUserRoleFn.checkForAdministratorRights, userController.processUpdateOneUser);
    router.put('/api/user/design/', verifyFn.verifyTokenUserID, validateFn.validateUpdateSubmission,userController.processUpdateOneDesign);
    router.post('/api/user/processInvitation/', verifyFn.verifyTokenUserID, validateFn.validateEmail,validateFn.validateSearchTitle, userController.processSendInvitation);

    router.get('/api/user/process-search-design/:pagenumber/:search?', verifyFn.verifyTokenUserID, validateFn.validateSearchTitle, userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?', verifyFn.verifyTokenUserID, checkUserRoleFn.checkForAdministratorRights, validateFn.validateSearchTitle, userController.processGetUserData);
    router.get('/api/user/process-search-user-design/:pagenumber/:search?', verifyFn.verifyTokenUserID, validateFn.validateEmail, checkUserRoleFn.checkForAdministratorRights, userController.processGetSubmissionsbyEmail);
    router.get('/api/user/design/:fileId', verifyFn.verifyTokenUserID, userController.processGetOneDesignData);
    router.get('/api/user/:recordId/:getType', verifyFn.verifyTokenUserID, userController.processGetOneUserData);
    
};