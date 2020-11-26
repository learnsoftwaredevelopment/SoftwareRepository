const axios = require('axios');
const config = require('./config');

const loginFireBase = async (email, password) => {
  const response = await axios.post(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${config.FIREBASE_CLIENT_API_KEY}`,
    { email, password, returnSecureToken: true },
  );

  return {
    idToken: response.data.idToken,
    refreshToken: response.data.refreshToken,
    uid: response.data.localId,
  };
};

module.exports = {
  loginFireBase,
};
