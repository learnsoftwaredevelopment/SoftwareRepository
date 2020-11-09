const authRouter = require('express').Router();
const authController = require('../../controllers/api/authController');
const { disabledAPIEndPoint } = require('../../utils/middleware');

authRouter.post('/', disabledAPIEndPoint, authController.postAuth);

authRouter.get('/', disabledAPIEndPoint, authController.getAuth);

module.exports = authRouter;
