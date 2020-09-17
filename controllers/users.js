const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");
const config = require("../utils/config");

usersRouter.get("/", async (req, res) => {
  const users = await User.find({})
    .populate("contributions.softwaresAdded", {
      name: 1,
    })
    .populate("contributions.softwaresContributed", {
      name: 1,
    });
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const body = req.body;

  if (!body.password) {
    return res.status(400).json({
      error: "`password` is required.",
    });
  } else if (body.password.length < 8) {
    return res.status(400).json({
      error: "Password has to be at least 8 characters long.",
    });
  }

  const saltRounds = config.BCRYPT_SALT_ROUNDS;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    email: body.email,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

module.exports = usersRouter;
