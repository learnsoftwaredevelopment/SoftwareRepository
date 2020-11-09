const User = require('../../../models/user');
const { loginFireBase } = require('../firebaseTestUtils');

const sampleUserInDb1 = {
  username: 'Sample',
  name: 'SampleName',
  email: 'sample@example.com',
};

const sampleUserCredential1 = {
  ...sampleUserInDb1,
  password: 'SamplePassword',
};

const sampleUserInDb2 = {
  username: 'Sample2',
  name: 'SampleName2',
  email: 'sample2@example.com',
};

const sampleUserCredential2 = {
  ...sampleUserInDb2,
  password: 'SamplePassword2',
};

const addUserToDb = async (userCredential) => {
  const { email, password } = userCredential;

  const withFirebaseId = {
    ...userCredential,
    firebaseUid: (await loginFireBase(email, password)).uid,
  };
  delete withFirebaseId.password;

  const userToAdd = new User(withFirebaseId);
  const response = await userToAdd.save();
  return response;
};

/**
 * Santizes user object for expected comparison
 * with user object returned from database (for testing purposes).
 * In other words, the username and email address are lowercase.
 * @param {Object} userObject
 */
const sanitizeUserObject = (userObject) => {
  const expectedUserObject = {
    ...userObject,
  };

  // As the username and email are stored in lowercase when inserting to database.
  expectedUserObject.username = expectedUserObject.username.toLowerCase();
  expectedUserObject.email = expectedUserObject.email.toLowerCase();

  return expectedUserObject;
};

module.exports = {
  sampleUserInDb1,
  sampleUserCredential1,
  sampleUserInDb2,
  sampleUserCredential2,
  addUserToDb,
  sanitizeUserObject,
};
