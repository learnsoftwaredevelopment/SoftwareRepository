const softwaresRouter = require("express").Router();
const Software = require("../models/software");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const getTokenFrom = (req) => {
  const authorization = req.get("Authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }

  return null;
};

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

  const token = getTokenFrom(req);
  const decodedToken = !token ? null : jwt.verify(token, config.JWT_SECRET);

  // Only registered users can post to softwares API endpoint
  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: "Missing or Invalid Token",
    });
  }

  const user = await User.findById(decodedToken.id);

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

module.exports = softwaresRouter;
