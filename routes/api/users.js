const usersRouter = require('express').Router();
const usersController = require('../../controllers/api/usersController');

usersRouter.get('/', usersController.getUsers);

usersRouter.post('/', usersController.postUsers);

usersRouter.post('/check', usersController.postUserAvailability);

module.exports = usersRouter;
