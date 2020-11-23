/**
 * Handles the environmental variables / Additional configuration
 */
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const NODE_ENVIRONMENT = process.env.NODE_ENV;
const MONGODB_URI = NODE_ENVIRONMENT === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;
const { TEST_FIREBASE_CLIENT_API_KEY } = process.env;
const ALLOWED_USERNAME_REGEX = '^[a-z0-9_]+$';

module.exports = {
  PORT,
  NODE_ENVIRONMENT,
  MONGODB_URI,
  TEST_FIREBASE_CLIENT_API_KEY,
  ALLOWED_USERNAME_REGEX,
};
