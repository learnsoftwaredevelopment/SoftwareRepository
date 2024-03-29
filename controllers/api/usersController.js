// eslint-disable-next-line import/no-unresolved
const { getAuth } = require('firebase-admin/auth');
const User = require('../../models/user');
const jwtUtils = require('../../utils/jwtUtils');
const { checkUsernameValidity } = require('../../utils/api/usersUtils');
const fireBaseAdminApp = require('../../utils/firebaseConfig');

const getUsers = async (req, res) => {
  const users = await User.find({}).populate([
    {
      path: 'contributions.softwaresAdded',
      select: 'name',
    },
    {
      path: 'contributions.softwaresContributed',
      select: 'name',
    },
  ]);
  return res.json(users);
};

const postUsers = async (req, res) => {
  const { username } = req.body;

  const authToken = jwtUtils.getReqAuthToken(req);

  const decodedToken = await jwtUtils.verifyAuthToken(authToken, false);

  if (!decodedToken) {
    return res.status(401).json({
      error: 'Missing/Invalid Token',
    });
  }

  const response = await getAuth(fireBaseAdminApp).getUser(decodedToken.uid);

  const userRecord = response.toJSON();

  const user = new User({
    username: !username ? null : username,
    name: userRecord.displayName,
    email: userRecord.email,
    firebaseUid: userRecord.uid,
  });

  const savedUser = await user.save();

  // Set custom claim with backend user id (different from firebase user id)
  await getAuth(fireBaseAdminApp).setCustomUserClaims(decodedToken.uid, {
    backendId: savedUser.id,
    username: savedUser.username,
  });

  return res.status(201).json(savedUser);
};

const postUserAvailability = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({
      error: 'Missing username in request.',
    });
  }

  const isValidUsername = checkUsernameValidity(username);

  if (!isValidUsername) {
    return res.status(400).json({
      error: 'Invalid username.',
    });
  }

  const response = await User.findOne({
    username,
  }).lean();

  return res.json({
    usernameStatus: response === null ? 'Available' : 'Not Available',
  });
};

module.exports = {
  getUsers,
  postUsers,
  postUserAvailability,
};
