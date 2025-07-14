const { checkSignUpBodyMiddleWare , checkLogInBodyMiddleWare} = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController.js');
const authRouter = require('express').Router();


authRouter.post('/signup',checkSignUpBodyMiddleWare,authController.signUpUser);
authRouter.post('/login',checkLogInBodyMiddleWare,authController.logInUser);
authRouter.get('/specializations',authController.getSpecializations)

module.exports = authRouter;