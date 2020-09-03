/**
 * Handles the environmental variables
 */
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const NODE_ENVIRONMENT = process.env.NODE_ENV;

module.exports = {
  PORT,
  NODE_ENVIRONMENT,
};
