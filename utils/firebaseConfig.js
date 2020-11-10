/**
 * Handles firebase configuration and implementation
 */

require('dotenv').config();
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
  databaseURL: 'https://auth-impl-dev.firebaseio.com',
});

module.exports = firebaseAdmin;
