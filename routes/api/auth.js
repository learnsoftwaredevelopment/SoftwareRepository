const authRouter = require('express').Router();
const authController = require('../../controllers/api/authController');

authRouter.post('/login', authController.postLogin);

authRouter.post('/refresh-token', authController.postRefreshToken);

module.exports = authRouter;
