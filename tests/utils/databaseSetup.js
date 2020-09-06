const User = require("../../models/user");

const sampleUserInDb1 = {
  username: "Sample",
  name: "SampleName",
  email: "sample@example.com",
  passwordHash: "SamplePasswordHash",
};

const sampleUserInDb2 = {
  username: "Sample2",
  name: "SampleName2",
  email: "sample2@example.com",
  passwordHash: "SamplePasswordHash2",
};

const addUserToDb = async (userObject) => {
  const userToAdd = new User(userObject);
  await userToAdd.save();
};

/**
 * Santize user object for expected comparison with user object returned from database.
 * @param {Object} userObject
 */
const sanitizeUserObject = async (userObject) => {
  let expectedUserObject = {
    ...userObject,
  };

  delete expectedUserObject.passwordHash;

  // As the username and email are stored in lowercase when inserting to database.
  expectedUserObject.username = expectedUserObject.username.toLowerCase();
  expectedUserObject.email = expectedUserObject.email.toLowerCase();

  return expectedUserObject;
};

module.exports = {
  sampleUserInDb1,
  sampleUserInDb2,
  addUserToDb,
  sanitizeUserObject,
};
