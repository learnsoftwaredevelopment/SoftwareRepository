const rootRouter = require("express").Router();
const rootController = require("../controllers/rootController");

rootRouter.get("/", rootController.getRoot);

module.exports = rootRouter;
