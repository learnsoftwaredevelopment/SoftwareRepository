const softwaresRouter = require("express").Router();
const Software = require("../models/software");
const User = require("../models/user");
const middleware = require("../utils/middleware");
const dotObject = require("dot-object");

softwaresRouter.get("/", async (req, res) => {
  const softwares = await Software.find({})
    .populate("meta.addedByUser", {
      username: 1,
      name: 1,
    })
    .populate("meta.updatedByUser", {
      username: 1,
      name: 1,
    });
  res.status(200).json(softwares);
});

softwaresRouter.post("/", middleware.tokenValidation, async (req, res) => {
  const body = req.body;

  const user = await User.findById(body.decodedToken.id);

  // Refer to software Model for required parameters.
  const softwareObject = {
    ...body,
    meta: {
      addedByUser: user._id,
      updatedByUser: user._id,
    },
  };

  delete softwareObject.token;

  const softwareAdded = new Software(softwareObject);

  const savedSoftware = await softwareAdded.save();

  const saved = await savedSoftware
    .populate("meta.addedByUser", {
      username: 1,
      name: 1,
    })
    .populate("meta.updatedByUser", {
      username: 1,
      name: 1,
    })
    .execPopulate();

  res.status(201).json(saved);
});

softwaresRouter.put("/:id", middleware.tokenValidation, async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  // To configure dotObject transformation to not modify how the array is represented.
  dotObject.keepArray = true;

  let newSoftware = {
    ...body,
  };

  newSoftware.meta.updatedByUser = body.decodedToken.id;

  // Transform object to dot notaton (dotted key and value pairs)
  // This serves as a workaround for mongoose update of nested objects
  newSoftware = dotObject.dot(newSoftware);

  const updatedSoftware = await Software.findByIdAndUpdate(id, newSoftware, {
    new: true,
  });

  const updated = await updatedSoftware
    .populate("meta.addedByUser", { username: 1, name: 1 })
    .populate("meta.updatedByUser", { username: 1, name: 1 })
    .execPopulate();

  res.status(200).json(updated);
});

softwaresRouter.get("/:id", async (req, res) => {
  const id = req.params.id;

  const software = await Software.findById(id);

  const response = await software
    .populate("meta.addedByUser", { username: 1, name: 1 })
    .populate("meta.updatedByUser", { username: 1, name: 1 })
    .execPopulate();

  res.status(200).json(response);
});

module.exports = softwaresRouter;
