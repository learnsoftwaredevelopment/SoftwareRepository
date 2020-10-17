const usersRouter = require("express").Router();
const usersController = require("../../controllers/api/usersController");

usersRouter.get("/", usersController.getUsers);

usersRouter.post("/", usersController.postUsers);

module.exports = usersRouter;
