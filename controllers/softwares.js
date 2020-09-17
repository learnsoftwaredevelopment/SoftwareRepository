const softwaresRouter = require("express").Router();
const Software = require("../models/software");
const middleware = require("../utils/middleware");
const dotObject = require("dot-object");
const User = require("../models/user");
const databaseUtils = require("../utils/databaseUtils");

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
  const userId = body.decodedToken.id;

  // Refer to software Model for required parameters.
  const softwareObject = {
    ...body,
    meta: {
      addedByUser: userId,
      updatedByUser: userId,
    },
  };

  delete softwareObject.token;

  const softwareAdded = new Software(softwareObject);

  const savedSoftware = await softwareAdded.save();

  const user = await User.findById(userId);

  user.contributions.softwaresAdded = user.contributions.softwaresAdded.concat(
    savedSoftware._id
  );
  user.contributions.softwaresContributed = user.contributions.softwaresContributed.concat(
    savedSoftware._id
  );

  await user.save();

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
  const userId = body.decodedToken.id;

  // To configure dotObject transformation to not modify how the array is represented.
  dotObject.keepArray = true;

  let newSoftware = {
    ...body,
  };

  newSoftware.meta.updatedByUser = userId;

  // Transform object to dot notaton (dotted key and value pairs)
  // This serves as a workaround for mongoose update of nested objects
  newSoftware = dotObject.dot(newSoftware);

  const updatedSoftware = await Software.findByIdAndUpdate(id, newSoftware, {
    new: true,
  });

  if (updatedSoftware === null) {
    return res.status(404).end();
  }

  const user = await User.findById(userId);

  if (!user.contributions.softwaresContributed.includes(id)) {
    user.contributions.softwaresContributed = user.contributions.softwaresContributed.concat(
      updatedSoftware._id
    );
    await user.save();
  }

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

softwaresRouter.delete("/:id", middleware.tokenValidation, async (req, res) => {
  const id = req.params.id;

  const response = await Software.findByIdAndDelete(id);

  if (response === null) {
    return res.status(404).end();
  }

  // To clean up fields in documents that have reference to the deleted software.
  databaseUtils.cleanUpSoftwareReferences(id);

  res.status(204).end();
});

module.exports = softwaresRouter;
