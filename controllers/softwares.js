const softwaresRouter = require("express").Router();
const Software = require("../models/software");
const User = require("../models/user");

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

softwaresRouter.post("/", async (req, res) => {
  const body = req.body;

  const defaultUser = await User.findOne({ username: "Sample" });

  // Refer to software Model for required parameters.
  const softwareObject = {
    ...body,
    meta: {
      addedByUser: defaultUser._id,
      updatedByUser: defaultUser._id,
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

module.exports = softwaresRouter;
