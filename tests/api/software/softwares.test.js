const app = require("../../../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const databaseSetupTestUtils = require("../../utils/databaseSetup");
const softwareTestUtils = require("../../utils/api/softwaresTestUtils");

const api = supertest(app);

let defaultUser;
let token;

beforeEach(async () => {
  await databaseSetupTestUtils.resetDatabase();
  defaultUser = await databaseSetupTestUtils.initialiseADefaultUserInDb();
  token = databaseSetupTestUtils.loginUserToken(defaultUser);
});

describe("Software Controller", () => {
  describe("GET request to /api/softwares/", () => {
    test("When there is no software in database, return status code 200 and json with an empty array of softwares", async () => {
      const initialSoftwaresInDb = await softwareTestUtils.softwaresInDb();
      expect(initialSoftwaresInDb).toHaveLength(0);

      const response = await api
        .get("/api/softwares")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveLength(0);
    });

    test("When there is one software in database, return status code 200 and json with only that software in the array", async () => {
      const softwareToAdd = softwareTestUtils.sampleSoftwareInDb1;

      await softwareTestUtils.addSoftwareToDb(
        softwareToAdd,
        defaultUser._id,
        defaultUser._id
      );

      const initialSoftwaresInDb = await softwareTestUtils.softwaresInDb();
      expect(initialSoftwaresInDb).toHaveLength(1);

      const response = await api
        .get("/api/softwares")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const expectedSoftware = {
        ...softwareToAdd,
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

    test("When there are two softwares in database, return status code 200 and json with only those two softwares in the array", async () => {
      const softwareToAdd1 = softwareTestUtils.sampleSoftwareInDb1;
      const softwareToAdd2 = softwareTestUtils.sampleSoftwareInDb2;

      await softwareTestUtils.addSoftwareToDb(
        softwareToAdd1,
        defaultUser._id,
        defaultUser._id
      );

      await softwareTestUtils.addSoftwareToDb(
        softwareToAdd2,
        defaultUser._id,
        defaultUser._id
      );

      const initialSoftwaresInDb = await softwareTestUtils.softwaresInDb();
      expect(initialSoftwaresInDb).toHaveLength(2);

      const response = await api
        .get("/api/softwares")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const expectedSoftware1 = {
        ...softwareToAdd1,
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

describe("Software Controller", () => {
  describe("POST request to /api/softwares/", () => {
    test("When missing Authorisation token, return with status 401 with json Missing or Invalid Token error message, no change in the number of softwares in database", async () => {
      const initialSoftwaresInDb = await softwareTestUtils.softwaresInDb();

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
        .post("/api/softwares")
        .send(softwareToAdd)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const softwaresInDb = await softwareTestUtils.softwaresInDb();
      expect(softwaresInDb).toHaveLength(initialSoftwaresInDb.length);
      expect(response.body.error).toBe("Missing or Invalid Token");
    });

    test("When invalid Authorisation token, return with status 401 with json Token missing or invalid error message, no change in the number of softwares in database", async () => {
      const initialSoftwaresInDb = await softwareTestUtils.softwaresInDb();

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
        .post("/api/softwares")
        .set("Authorization", "bearer invalid token")
        .send(softwareToAdd)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      const softwaresInDb = await softwareTestUtils.softwaresInDb();
      expect(softwaresInDb).toHaveLength(initialSoftwaresInDb.length);
      expect(response.body.error).toBe("Invalid Token");
    });

    test("When request is valid, number of softwares in database increments by 1", async () => {
      const initialSoftwaresInDb = await softwareTestUtils.softwaresInDb();

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
        .post("/api/softwares")
        .set("Authorization", databaseSetupTestUtils.formattedToken(token))
        .send(softwareToAdd)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const softwaresInDb = await softwareTestUtils.softwaresInDb();
      expect(softwaresInDb).toHaveLength(initialSoftwaresInDb.length + 1);
      expect(response.body).toMatchObject(softwareToAdd);
    });
  });
});

afterAll(async () => {
  await databaseSetupTestUtils.resetDatabase();
  await mongoose.connection.close();
});
