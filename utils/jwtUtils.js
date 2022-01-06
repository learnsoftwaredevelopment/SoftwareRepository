// eslint-disable-next-line import/no-unresolved
const { getAuth } = require('firebase-admin/auth');
const { fireBaseAdminApp } = require('./firebaseConfig');
const User = require('../models/user');

const getReqAuthToken = (req) => {
  const authorization = req.get('Authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }

  return null;
};

/**
 * Verify the input jwt Authorisation bearer token.
 * Returns null if missing/invalid token.
 * If checkDatabase parameter is set to true, there is
 * additional check whether the firebase user id is in database
 * and the username in the jwt custom claim matches that in database.
 * @param {String} authToken The jwt Authorisation bearer token
 * @param {Boolean} checkDatabase Whether to check database if
 * the firebase user id is present in the database.
 */
const verifyAuthToken = async (authToken, checkDatabase) => {
  // Return null, it is missing token
  if (!authToken) {
    return null;
  }

  const decodedAuthToken = await getAuth(fireBaseAdminApp).verifyIdToken(
    authToken,
    true,
  );

  // If the checkDatabase parameter is set to true,
  // a lookup will be made to check whether the firebase uid is in the database
  // and if the username in the auth token matches the username linked
  // to the firebase uid in the database.
  if (checkDatabase) {
    const user = await User.findOne({ firebaseUid: decodedAuthToken.uid });
    const usernameMatch = user && user.username === decodedAuthToken.username;
    if (!usernameMatch) {
      return null;
    }
  }

  return decodedAuthToken;
};

module.exports = {
  getReqAuthToken,
  verifyAuthToken,
};
