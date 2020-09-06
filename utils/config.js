/**
 * Handles the environmental variables
 */
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const NODE_ENVIRONMENT = process.env.NODE_ENV;
const MONGODB_URI =
  NODE_ENVIRONMENT === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

module.exports = {
  PORT,
  NODE_ENVIRONMENT,
  MONGODB_URI,
  BCRYPT_SALT_ROUNDS,
};
