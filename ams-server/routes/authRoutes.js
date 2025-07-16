const authController = require('../controllers/authController.js');
const { verify } = require('../middlewares/authMiddleware.js');
const authRouter = require('express').Router();


authRouter.post('/signup',authController.signUpUser);
authRouter.post('/login',authController.logInUser);
authRouter.get('/authorized',verify,authController.checkAuthorization)
authRouter.get('/specializations',authController.getSpecializations);

module.exports = authRouter;