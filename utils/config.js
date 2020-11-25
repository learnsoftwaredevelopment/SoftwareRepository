/**
 * Handles the environmental variables
 */
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const NODE_ENVIRONMENT = process.env.NODE_ENV;
const MONGODB_URI = NODE_ENVIRONMENT === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI;
const { FIREBASE_CLIENT_API_KEY } = process.env;

module.exports = {
  PORT,
  NODE_ENVIRONMENT,
  MONGODB_URI,
  FIREBASE_CLIENT_API_KEY,
};
