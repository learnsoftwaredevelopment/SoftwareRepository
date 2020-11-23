const usersRouter = require('express').Router();
const usersController = require('../../controllers/api/usersController');

usersRouter.get('/', usersController.getUsers);

usersRouter.post('/', usersController.postUsers);

usersRouter.post('/check', usersController.getUserAvailability);

module.exports = usersRouter;
