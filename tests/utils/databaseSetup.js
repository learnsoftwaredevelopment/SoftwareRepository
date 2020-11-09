const User = require('../../models/user');
const Software = require('../../models/software');
const firebaseTestUtils = require('./firebaseTestUtils');
const firebaseAdmin = require('../../utils/firebaseConfig');

const resetDatabase = async () => {
  await User.deleteMany({});
  await Software.deleteMany({});
};

const usersInDb = async () => {
  const users = await User.find({});
  return users;
};

const softwareInDb = async () => {
  const software = await Software.find({});
  return software;
};

const setBackendIdOfDefaultUser = async (userCredential, backendId) => {
  const { email, password } = userCredential;
  const { uid } = await firebaseTestUtils.loginFireBase(email, password);

  // Set custom claim with backend user id (different from firebase user id)
  await firebaseAdmin.auth().setCustomUserClaims(uid, { backendId });
};

module.exports = {
  resetDatabase,
  usersInDb,
  softwareInDb,
  setBackendIdOfDefaultUser,
};
