const rootRouter = require("express").Router();

rootRouter.get("/", (req, res) => {
  res.send("<h1>App is running</h1>");
});

module.exports = rootRouter;
