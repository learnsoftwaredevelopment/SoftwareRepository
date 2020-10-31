const jwt = require('jsonwebtoken');
const config = require('./config');
const User = require('../models/user');

const getReqAuthToken = (req) => {
  const authorization = req.get('Authorization');

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }

  return null;
};

/**
 * Verify the input jwt token.
 * Returns null if invalid/missing token or the user id in the payload is not found in database.
 * If the token is valid and the user id is valid, returns the decoded token.
 * @param {String} authToken The jwt user token
 */
const verifyAuthToken = async (authToken) => {
  const decodedAuthToken = !authToken
    ? null
    : jwt.verify(authToken, config.JWT_SECRET);

  // Return null, it is an invalid token or the user id is not found in database.
  if (!authToken || !(await User.findById(decodedAuthToken.id))) {
    return null;
  }

  return decodedAuthToken;
};

module.exports = {
  getReqAuthToken,
  verifyAuthToken,
};
