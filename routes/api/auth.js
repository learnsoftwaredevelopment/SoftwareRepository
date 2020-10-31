const authRouter = require('express').Router();
const authController = require('../../controllers/api/authController');

authRouter.post('/', authController.postAuth);

authRouter.get('/', authController.getAuth);

module.exports = authRouter;
