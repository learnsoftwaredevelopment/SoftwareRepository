const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const databaseSetup = require('../utils/databaseSetup');
const usersTestUtils = require('../utils/api/usersTestUtils');
const softwareTestUtils = require('../utils/api/softwareTestUtils');
const firebaseTestUtils = require('../utils/firebaseTestUtils');

const api = supertest(app);

let defaultUser;

beforeEach(async () => {
  await databaseSetup.resetDatabase();
  defaultUser = await usersTestUtils.addUserToDb(
    usersTestUtils.sampleUserCredential1,
  );
  await databaseSetup.setBackendIdOfDefaultUser(
    usersTestUtils.sampleUserCredential1,
    defaultUser.id,
  );
});

describe('Software Controller', () => {
  describe('GET request to /api/software/', () => {
    test('When there is no software in database, return status code 200 and json with an empty array of softwares', async () => {
      const initialSoftwareInDb = await databaseSetup.softwareInDb();
      expect(initialSoftwareInDb).toHaveLength(0);

      const response = await api
        .get('/api/software')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      expect(response.body).toHaveLength(0);
    });

    test('When there is one software in database, return status code 200 and json with only that software in the array', async () => {
      const softwareToAdd = softwareTestUtils.sampleSoftwareInDb1;

      await softwareTestUtils.addSoftwareToDb(
        softwareToAdd,
        defaultUser._id,
        defaultUser._id,
      );

      const initialSoftwareInDb = await databaseSetup.softwareInDb();
      expect(initialSoftwareInDb).toHaveLength(1);

      const response = await api
        .get('/api/software')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const expectedSoftware = {
        ...softwareToAdd,
        // Since the name and platform values are stored in lowercase in the database.
        name: softwareToAdd.name.toLowerCase(),
        platform: softwareToAdd.platform.toLowerCase(),
        meta: {
          addedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
          updatedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
        },
      };

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject(expectedSoftware);
    });

    test('When there are two softwares in database, return status code 200 and json with only those two softwares in the array', async () => {
      const softwareToAdd1 = softwareTestUtils.sampleSoftwareInDb1;
      const softwareToAdd2 = softwareTestUtils.sampleSoftwareInDb2;

      await softwareTestUtils.addSoftwareToDb(
        softwareToAdd1,
        defaultUser._id,
        defaultUser._id,
      );

      await softwareTestUtils.addSoftwareToDb(
        softwareToAdd2,
        defaultUser._id,
        defaultUser._id,
      );

      const initialSoftwareInDb = await databaseSetup.softwareInDb();
      expect(initialSoftwareInDb).toHaveLength(2);

      const response = await api
        .get('/api/software')
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const expectedSoftware1 = {
        ...softwareToAdd1,
        // Since the name and platform values are stored in lowercase in the database.
        name: softwareToAdd1.name.toLowerCase(),
        platform: softwareToAdd1.platform.toLowerCase(),
        meta: {
          addedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
          updatedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
        },
      };

      const expectedSoftware2 = {
        ...softwareToAdd2,
        // Since the name and platform values are stored in lowercase in the database.
        name: softwareToAdd2.name.toLowerCase(),
        platform: softwareToAdd2.platform.toLowerCase(),
        meta: {
          addedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
          updatedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
        },
      };

      expect(response.body).toHaveLength(2);
      expect(response.body).toMatchObject([
        expectedSoftware1,
        expectedSoftware2,
      ]);
    });
  });
});

describe('Software Controller', () => {
  describe('POST request to /api/software/', () => {
    test('When missing Authorisation token, return with status 401 with json Missing or Invalid Token error message, no change in the number of softwares in database', async () => {
      const initialSoftwareInDb = await databaseSetup.softwareInDb();

      const softwareToAdd = {
        ...softwareTestUtils.sampleSoftwareInDb1,
        meta: {
          addedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
          updatedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
        },
      };

      const response = await api
        .post('/api/software/')
        .send(softwareToAdd)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      const softwareInDb = await databaseSetup.softwareInDb();
      expect(softwareInDb).toHaveLength(initialSoftwareInDb.length);
      expect(response.body.error).toBe('Missing Token');
    });

    test('When invalid Authorisation token, return with status 401 with json Token missing or invalid error message, no change in the number of softwares in database', async () => {
      const initialSoftwareInDb = await databaseSetup.softwareInDb();

      const softwareToAdd = {
        ...softwareTestUtils.sampleSoftwareInDb1,
        meta: {
          addedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
          updatedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
        },
      };

      const response = await api
        .post('/api/software/')
        .set('Authorization', 'bearer invalid token')
        .send(softwareToAdd)
        .expect(401)
        .expect('Content-Type', /application\/json/);

      const softwareInDb = await databaseSetup.softwareInDb();
      expect(softwareInDb).toHaveLength(initialSoftwareInDb.length);
      expect(response.body.error).toBe('Invalid Token');
    });

    test('When request is valid, number of softwares in database increments by 1', async () => {
      const { email, password } = usersTestUtils.sampleUserCredential1;
      const { idToken } = await firebaseTestUtils.loginFireBase(
        email,
        password,
      );

      const initialSoftwareInDb = await databaseSetup.softwareInDb();

      const softwareToAdd = {
        ...softwareTestUtils.sampleSoftwareInDb1,
        meta: {
          addedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
          updatedByUser: {
            username: defaultUser.username,
            name: defaultUser.name,
          },
        },
      };

      const response = await api
        .post('/api/software/')
        .set('Authorization', `bearer ${idToken}`)
        .send(softwareToAdd)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const expectedSoftware = {
        ...softwareToAdd,
        // Since the name and platform values are stored in lowercase in the database.
        name: softwareToAdd.name.toLowerCase(),
        platform: softwareToAdd.platform.toLowerCase(),
      };

      const softwareInDb = await databaseSetup.softwareInDb();
      expect(softwareInDb).toHaveLength(initialSoftwareInDb.length + 1);
      expect(response.body).toMatchObject(expectedSoftware);
    });
  });
});

afterAll(async () => {
  await databaseSetup.resetDatabase();
  await mongoose.connection.close();
});
