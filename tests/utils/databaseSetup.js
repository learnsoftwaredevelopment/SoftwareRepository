const User = require("../../models/user");
const Software = require("../../models/software");
const config = require("../../utils/config");
const bcrypt = require("bcrypt");
const usersTestUtils = require("./api/usersTestUtils");
const jwt = require("jsonwebtoken");

const resetDatabase = async () => {
  await User.deleteMany({});
  await Software.deleteMany({});
};

const initialiseADefaultUserInDb = async () => {
  const saltRounds = config.BCRYPT_SALT_ROUNDS;
  const passwordHash = await bcrypt.hash("SamplePassword", saltRounds);

  const userToAdd = {
    username: "Sample",
    name: "SampleName",
    email: "sample@example.com",
    passwordHash,
  };

  const defaultUser = await usersTestUtils.addUserToDb(userToAdd);

  return defaultUser;
};

const loginUserToken = (testUser) => {
  const userForToken = {
    username: testUser.username,
    id: testUser._id,
  };

  const token = jwt.sign(userForToken, config.JWT_SECRET);

  return token;
};

const formattedToken = (token) => {
  return `bearer ${token}`;
};

module.exports = {
  resetDatabase,
  initialiseADefaultUserInDb,
  loginUserToken,
  formattedToken,
};
