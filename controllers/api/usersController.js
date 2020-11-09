const User = require('../../models/user');
const firebaseAdmin = require('../../utils/firebaseConfig');
const jwtUtils = require('../../utils/jwtUtils');

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
  const { body } = req;

  const authToken = jwtUtils.getReqAuthToken(req);
  const decodedToken = await jwtUtils.verifyAuthToken(authToken, false);

  const response = await firebaseAdmin.auth().getUser(decodedToken.uid);

  const userRecord = response.toJSON();

  const user = new User({
    username: body.username,
    name: userRecord.displayName,
    email: userRecord.email,
    firebaseUid: userRecord.uid,
  });

  const savedUser = await user.save();

  // Set custom claim with backend user id (different from firebase user id)
  await firebaseAdmin
    .auth()
    .setCustomUserClaims(decodedToken.uid, { backendId: savedUser.id });

  return res.status(201).json(savedUser);
};

module.exports = {
  getUsers,
  postUsers,
};
