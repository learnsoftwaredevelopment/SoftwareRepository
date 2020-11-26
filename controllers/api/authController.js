const axios = require('axios');
const config = require('../../utils/config');
const firebaseUtils = require('../../utils/firebaseUtils');

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { idToken, refreshToken, uid } = await firebaseUtils.loginFireBase(
      email,
      password,
    );

    return res.status(200).json({
      idToken,
      refreshToken,
      uid,
    });
  } catch (err) {
    res.status(err.response.data.error.code).json({
      error: err.response.data.error.message,
    });
  }
};

const postRefreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const response = await axios.post(
      `https://securetoken.googleapis.com/v1/token?key=${config.FIREBASE_CLIENT_API_KEY}`,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      {
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
      },
    );

    return res.status(200).json({
      idToken: response.data.id_token,
      refreshToken: response.data.refresh_token,
      uid: response.data.user_id,
    });
  } catch (err) {
    res.status(err.response.data.error.code).json({
      error: err.response.data.error.message,
    });
  }
};

module.exports = {
  postLogin,
  postRefreshToken,
};
