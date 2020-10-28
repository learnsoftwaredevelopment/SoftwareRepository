/* eslint-disable no-console */

/**
 * Handles the logging
 */
const config = require('./config');

const info = (...params) => {
  // To disable logging to console in test environment
  if (config.NODE_ENVIRONMENT !== 'test') {
    console.log(...params);
  }
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info,
  error,
};
