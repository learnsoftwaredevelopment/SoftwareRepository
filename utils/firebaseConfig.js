/**
 * Handles firebase configuration and implementation
 */

require('dotenv').config();
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    type: process.env.FIREBASE_ADMIN_SA_TYPE,
    project_id: process.env.FIREBASE_ADMIN_SA_PROJECT_ID,
    private_key_id: process.env.FIREBASE_ADMIN_SA_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_ADMIN_SA_PRIVATE_KEY.replace(
      /\\n/g,
      '\n',
    ),
    client_email: process.env.FIREBASE_ADMIN_SA_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_ADMIN_SA_CLIENT_ID,
    auth_uri: process.env.FIREBASE_ADMIN_SA_AUTH_URI,
    token_uri: process.env.FIREBASE_ADMIN_SA_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_ADMIN_SA_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_ADMIN_SA_CLIENT_X509_CERT_URL,
  }),
  databaseURL: 'https://auth-impl-dev.firebaseio.com',
});

module.exports = firebaseAdmin;
