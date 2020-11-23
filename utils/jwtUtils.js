const firebaseAdmin = require('./firebaseConfig');
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
 * Returns null if missing token or the user id in the payload is not found in database.
 * If checkDatabase parameter is set to true, there is
 * additional check whether the firebase user id is in database.
 * @param {String} authToken The jwt Authorisation bearer token
 * @param {Boolean} checkDatabase Whether to check database if
 * the firebase user id is present in the database.
 */
const verifyAuthToken = async (authToken, checkDatabase) => {
  // Return null, it is missing token
  if (!authToken) {
    return null;
  }

  const decodedAuthToken = await firebaseAdmin
    .auth()
    .verifyIdToken(authToken, true);

  const user = await User.findOne({ firebaseUid: decodedAuthToken.uid });

  // If the checkDatabase parameter is set to true
  // and the user id is not found in database, return null.
  if (checkDatabase && !user) {
    return null;
  }

  return decodedAuthToken;
};

module.exports = {
  getReqAuthToken,
  verifyAuthToken,
};
