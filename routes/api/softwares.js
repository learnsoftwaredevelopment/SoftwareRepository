const softwaresRouter = require("express").Router();
const middleware = require("../../utils/middleware");
const softwaresControllers = require("../../controllers/api/softwaresController");

softwaresRouter.get("/", softwaresControllers.getSoftwares);

softwaresRouter.post(
  "/",
  middleware.tokenValidation,
  softwaresControllers.postSoftwares
);

softwaresRouter.put(
  "/:id",
  middleware.tokenValidation,
  softwaresControllers.putSoftware
);

softwaresRouter.get("/:id", softwaresControllers.getSoftware);

softwaresRouter.delete(
  "/:id",
  middleware.tokenValidation,
  softwaresControllers.deleteSoftware
);

module.exports = softwaresRouter;
