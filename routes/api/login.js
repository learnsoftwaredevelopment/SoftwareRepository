const loginRouter = require("express").Router();
const loginController = require("../../controllers/api/loginController");

loginRouter.post("/", loginController.postLogin);

module.exports = loginRouter;
