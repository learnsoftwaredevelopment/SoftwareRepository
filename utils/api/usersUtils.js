const { ALLOWED_USERNAME_REGEX } = require('../config');

const checkUsernameValidity = (username) => {
  const formattedUsername = username.toLowerCase();
  return RegExp(ALLOWED_USERNAME_REGEX).test(formattedUsername);
};

module.exports = {
  checkUsernameValidity,
};
