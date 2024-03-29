/**
 * Not tested as it was based on custom JWT Authentication
 * before the migration to firebase Authentication.
 *
 * The current implementation of the Auth API endpoint is
 * a wrapper of the firebase Authentication Rest API.
 */

const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../../app');
const databaseSetupTestUtils = require('../../../utils/databaseSetup');
const { initialiseADefaultUserInDb } = require('../../../utils/databaseSetup');

const api = supertest(app);

beforeEach(async () => {
  await databaseSetupTestUtils.resetDatabase();
  await initialiseADefaultUserInDb();
});

describe('Auth Controller', () => {
  describe('POST request to /api/auth/', () => {
    test('When the username is incorrect, return status code 401 and json with error Invalid username and/or password message', async () => {
      const loginUser = {
        username: 'Sampl',
        password: 'SamplePassword',
      };

      const response = await api
        .post('/api/auth')
        .send(loginUser)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('Invalid username and/or password.');
    });

    test('When the password is incorrect, return status code 401 and json with error Invalid username and/or password message', async () => {
      const loginUser = {
        username: 'Sample',
        password: 'SamplePasswor',
      };

      const response = await api
        .post('/api/auth')
        .send(loginUser)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('Invalid username and/or password.');
    });

    test('When the username and password are incorrect, return status code 401 and json with error Invalid username and/or password message', async () => {
      const loginUser = {
        username: 'Sampl',
        password: 'SamplePasswor',
      };

      const response = await api
        .post('/api/auth')
        .send(loginUser)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('Invalid username and/or password.');
    });

    test('When the username and password are correct, return status code 200 and json with error Invalid username and/or password message', async () => {
      const loginUser = {
        username: 'Sample',
        password: 'SamplePassword',
      };

      const response = await api
        .post('/api/auth')
        .send(loginUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const expected = {
        username: loginUser.username.toLowerCase(),
        name: 'SampleName',
      };

      expect(response.body).toMatchObject(expected);
    });
  });
});

afterAll(async () => {
  await databaseSetupTestUtils.resetDatabase();
  await mongoose.connection.close();
});
