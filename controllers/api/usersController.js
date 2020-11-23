const User = require('../../models/user');
const firebaseAdmin = require('../../utils/firebaseConfig');
const jwtUtils = require('../../utils/jwtUtils');
const { ALLOWED_USERNAME_REGEX } = require('../../utils/config');

const getUsers = async (req, res) => {
  const users = await User.find({})
    .populate('contributions.softwaresAdded', {
      name: 1,
    })
    .populate('contributions.softwaresContributed', {
      name: 1,
    });
  return res.json(users);
};

const postUsers = async (req, res) => {
  const { username } = req.body;

  const authToken = jwtUtils.getReqAuthToken(req);

  const decodedToken = await jwtUtils.verifyAuthToken(authToken, false);

  if (!decodedToken) {
    return res.status(401).json({
      error: 'Missing Token',
    });
  }

  const response = await firebaseAdmin.auth().getUser(decodedToken.uid);

  const userRecord = response.toJSON();

  const user = new User({
    username: !username ? null : username.trim(),
    name: userRecord.displayName,
    email: userRecord.email,
    firebaseUid: userRecord.uid,
  });

  const savedUser = await user.save();

  // Set custom claim with backend user id (different from firebase user id)
  await firebaseAdmin.auth().setCustomUserClaims(decodedToken.uid, {
    backendId: savedUser.id,
    username,
  });

  return res.status(201).json(savedUser);
};

const getUserAvailability = async (req, res) => {
  const { username } = req.body;

  const formattedUsername = username.toLowerCase();

  const checkUsernamePattern = RegExp(ALLOWED_USERNAME_REGEX).test(
    formattedUsername,
  );

  if (!checkUsernamePattern) {
    return res.status(400).json({
      error: 'Invalid username.',
    });
  }

  const response = await User.findOne({
    username: formattedUsername,
  }).lean();

  return res.json({
    usernameStatus: response === null ? 'Available' : 'Not Available',
  });
};

module.exports = {
  getUsers,
  postUsers,
  getUserAvailability,
};
