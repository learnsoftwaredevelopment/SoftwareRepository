const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const config = require('../../utils/config');
const { getReqAuthToken, verifyAuthToken } = require('../../utils/jwtUtils');

const postAuth = async (req, res) => {
  const { body } = req;

  // Return the user before update so can view last login.
  const user = await User.findOneAndUpdate(
    { username: body.username },
    {
      'meta.lastLogin': Date.now(),
    },
  );

  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status('401').json({
      error: 'Invalid username and/or password.',
    });
  }

  const userTokenPayload = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(userTokenPayload, config.JWT_SECRET);

  return res.status(200).json({
    token,
    username: user.username,
    name: user.name,
    lastLogin: user.meta.lastLogin,
  });
};

const getAuth = async (req, res) => {
  const token = getReqAuthToken(req);
  const decodedToken = await verifyAuthToken(token);

  if (!decodedToken) {
    return res.status(401).json({
      error: 'Missing or Invalid Token',
    });
  }

  return res.status(200).json({
    ...decodedToken,
  });
};

module.exports = {
  postAuth,
  getAuth,
};
