const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const databaseSetup = require('../utils/databaseSetup');
const usersTestUtils = require('../utils/api/usersTestUtils');
const firebaseTestUtils = require('../utils/firebaseTestUtils');

const api = supertest(app);

beforeEach(async () => {
  await databaseSetup.resetDatabase();
});

describe('Users Controller', () => {
  describe('GET request to /api/users/', () => {
    test('When there is no user in database, return status code 200 and json with an empty array of users', async () => {
      const initialUsersInDb = await databaseSetup.usersInDb();
      expect(initialUsersInDb).toHaveLength(0);

      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toHaveLength(0);
    });

    test('When there is one user in database, return status code 200 and json with only that user in the array', async () => {
      const userToAdd = usersTestUtils.sampleUserCredential1;
      await usersTestUtils.addUserToDb(userToAdd);

      const initialUsersInDb = await databaseSetup.usersInDb();
      expect(initialUsersInDb).toHaveLength(1);

      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const expectedUser = usersTestUtils.sanitizeUserObject(
        usersTestUtils.sampleUserInDb1,
      );

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject(expectedUser);
    });

    test('When there are two users in database, return status code 200 and json with only those two users in the array', async () => {
      const user1ToAdd = usersTestUtils.sampleUserCredential1;
      const user2ToAdd = usersTestUtils.sampleUserCredential2;
      await usersTestUtils.addUserToDb(user1ToAdd);
      await usersTestUtils.addUserToDb(user2ToAdd);

      const initialUsersInDb = await databaseSetup.usersInDb();
      expect(initialUsersInDb).toHaveLength(2);

      const response = await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const expectedUser1 = usersTestUtils.sanitizeUserObject(
        usersTestUtils.sampleUserInDb1,
      );

      const expectedUser2 = usersTestUtils.sanitizeUserObject(
        usersTestUtils.sampleUserInDb2,
      );

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject(expectedUser1);
      expect(response.body[1]).toMatchObject(expectedUser2);
    });
  });

  /**
   * Note some test cases for validation which was present in the previous commits
   * were removed as validation such as email, firebaseUid, etc
   * are handled by firebase Authentication
   */
  describe('POST request to /api/users/', () => {
    test('(Test one mongodb buildin validator) When username is missing, return json with error missing username message', async () => {
      const { email, password } = usersTestUtils.sampleUserCredential1;
      const { idToken } = await firebaseTestUtils.loginFireBase(
        email,
        password,
      );

      const reqBody = {};

      const initialUsersInDb = await databaseSetup.usersInDb();

      const response = await api
        .post('/api/users/')
        .set('Authorization', `bearer ${idToken}`)
        .send(reqBody)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersInDb = await databaseSetup.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);
      expect(response.body.error).toEqual({
        username: 'Missing username',
      });
    });

    test('(Test one mongodb buildin validator) When username is less than 6 characters long , return json with error the username should be at least 6 characters long', async () => {
      const { email, password } = usersTestUtils.sampleUserCredential1;
      const { idToken } = await firebaseTestUtils.loginFireBase(
        email,
        password,
      );

      const reqBody = {
        username: '123',
      };

      const initialUsersInDb = await databaseSetup.usersInDb();

      const response = await api
        .post('/api/users/')
        .set('Authorization', `bearer ${idToken}`)
        .send(reqBody)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersInDb = await databaseSetup.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);
      expect(response.body.error).toEqual({
        username: 'The username should be at least 6 characters long',
      });
    });

    test('(Test custom validator) When username is containing unsupported characters like spaces, return json with error A valid username is required message', async () => {
      const { email, password } = usersTestUtils.sampleUserCredential1;
      const { idToken } = await firebaseTestUtils.loginFireBase(
        email,
        password,
      );

      const reqBody = {
        username: 'Sample username',
      };

      const initialUsersInDb = await databaseSetup.usersInDb();

      const response = await api
        .post('/api/users/')
        .set('Authorization', `bearer ${idToken}`)
        .send(reqBody)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      const usersInDb = await databaseSetup.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);

      const expectedError = {
        username: 'A valid username is required',
      };

      expect(response.body.error).toEqual(expectedError);
    });
  });

  test("(Test unique validator) When username ('sample') already exists in database, return json with error username must be unique. message", async () => {
    const { email, password } = usersTestUtils.sampleUserCredential2;
    const { idToken } = await firebaseTestUtils.loginFireBase(email, password);

    const reqBody = {
      username: 'Sample',
    };

    await usersTestUtils.addUserToDb(usersTestUtils.sampleUserCredential1);

    const initialUsersInDb = await databaseSetup.usersInDb();

    const response = await api
      .post('/api/users/')
      .set('Authorization', `bearer ${idToken}`)
      .send(reqBody)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersInDb = await databaseSetup.usersInDb();

    expect(usersInDb).toHaveLength(initialUsersInDb.length);

    const expectedError = {
      username: 'username must be unique.',
    };

    expect(response.body.error).toEqual(expectedError);
  });

  test("(Test multiple unique validators) When email ('sample@example.com') and firebase uid already exists in database, return json with error email must be unique. and firebaseUid must be unique messages", async () => {
    const { email, password } = usersTestUtils.sampleUserCredential1;
    const { idToken } = await firebaseTestUtils.loginFireBase(email, password);

    const reqBody = {
      username: 'Sample2',
    };

    await usersTestUtils.addUserToDb(usersTestUtils.sampleUserCredential1);

    const initialUsersInDb = await databaseSetup.usersInDb();

    const response = await api
      .post('/api/users/')
      .set('Authorization', `bearer ${idToken}`)
      .send(reqBody)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersInDb = await databaseSetup.usersInDb();

    expect(usersInDb).toHaveLength(initialUsersInDb.length);

    const expectedContainedError = {
      email: 'email must be unique.',
      firebaseUid: 'firebaseUid must be unique.',
    };

    expect(response.body.error).toEqual(expectedContainedError);
  });

  test('When request is valid, number of users in database increment by 1', async () => {
    const { email, password } = usersTestUtils.sampleUserCredential1;
    const { idToken, uid } = await firebaseTestUtils.loginFireBase(
      email,
      password,
    );

    const reqBody = {
      username: 'Sample',
    };

    const initialUsersInDb = await databaseSetup.usersInDb();

    const response = await api
      .post('/api/users/')
      .send(reqBody)
      .set('Authorization', `bearer ${idToken}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersInDb = await databaseSetup.usersInDb();
    expect(usersInDb).toHaveLength(initialUsersInDb.length + 1);

    // Lowercase as the username and email fields
    // are converted to lowercase before inserting into database.
    const expectedUser = {
      username: 'sample',
      name: 'SampleName',
      email: 'sample@example.com',
      firebaseUid: uid,
    };

    expect(response.body).toMatchObject(expectedUser);
  });
});

afterAll(async () => {
  await databaseSetup.resetDatabase();
  await mongoose.connection.close();
});
