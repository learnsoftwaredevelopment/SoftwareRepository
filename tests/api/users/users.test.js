const app = require("../../../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const databaseSetupTestUtils = require("../../utils/databaseSetup");
const usersTestUtils = require("../../utils/api/users");

const api = supertest(app);

beforeEach(async () => {
  await databaseSetupTestUtils.resetDatabase();
});

describe("Users Controller", () => {
  describe("GET request to /api/users/", () => {
    test("When there is no user in database, return status code 200 and json with an empty array of users", async () => {
      const initialUsersInDb = await usersTestUtils.usersInDb();
      expect(initialUsersInDb).toHaveLength(0);

      const response = await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      expect(response.body).toHaveLength(0);
    });

    test("When there is one user in database, return status code 200 and json with only that user in the array", async () => {
      const userToAdd = usersTestUtils.sampleUserInDb1;
      await usersTestUtils.addUserToDb(userToAdd);

      const initialUsersInDb = await usersTestUtils.usersInDb();
      expect(initialUsersInDb).toHaveLength(1);

      const response = await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const expectedUser = usersTestUtils.sanitizeUserObject(userToAdd);

      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject(expectedUser);
    });

    test("When there are two users in database, return status code 200 and json with only those two users in the array", async () => {
      const user1ToAdd = usersTestUtils.sampleUserInDb1;
      const user2ToAdd = usersTestUtils.sampleUserInDb2;
      await usersTestUtils.addUserToDb(user1ToAdd);
      await usersTestUtils.addUserToDb(user2ToAdd);

      const initialUsersInDb = await usersTestUtils.usersInDb();
      expect(initialUsersInDb).toHaveLength(2);

      const response = await api
        .get("/api/users")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const expectedUser1 = usersTestUtils.sanitizeUserObject(user1ToAdd);
      const expectedUser2 = usersTestUtils.sanitizeUserObject(user2ToAdd);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject(expectedUser1);
      expect(response.body[1]).toMatchObject(expectedUser2);
    });
  });

  describe("POST request to /api/users/", () => {
    test("(Test one mongodb buildin validator) When username is missing, return json with error missing username message", async () => {
      const userToAdd = {
        name: "SampleName",
        email: "sample@example.com",
        password: "SamplePassword",
      };

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);
      expect(response.body.error).toEqual({
        username: "Missing username",
      });
    });

    test("(Test custom validator) When username is containing unsupported characters like spaces, return json with error A valid username is required message", async () => {
      const userToAdd = {
        username: "Sample username",
        name: "SampleName",
        email: "sample@example.com",
        password: "SamplePassword",
      };

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);

      const expectedError = {
        username: "A valid username is required",
      };

      expect(response.body.error).toEqual(expectedError);
    });

    test("(Test custom validator) When email is invalid, return json with error A valid email address is required message", async () => {
      const userToAdd = {
        username: "Sample",
        name: "SampleName",
        email: "sample@.com",
        password: "SamplePassword",
      };

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);

      const expectedError = {
        email: "A valid email address is required",
      };

      expect(response.body.error).toEqual(expectedError);
    });

    test("(Test more than one custom validator violations) When username is containing unsupported characters like spaces and email address is invalid, return json with error A valid username is required message and a valid email address is required message", async () => {
      const userToAdd = {
        username: "Sample username",
        name: "SampleName",
        email: "sample@.com",
        password: "SamplePassword",
      };

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);

      const expectedError = {
        username: "A valid username is required",
        email: "A valid email address is required",
      };

      expect(response.body.error).toEqual(expectedError);
    });

    test("(Test unique validator) When username ('sample') already exists in database, return json with error Error, expected `username` to be unique. Value: `sample` message", async () => {
      const userToAdd = {
        username: "Sample",
        name: "SampleName2",
        email: "sample2@example.com",
        password: "SamplePassword2",
      };

      await usersTestUtils.addUserToDb(usersTestUtils.sampleUserInDb1);

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);

      const expectedError = {
        username: `Error, expected \`username\` to be unique. Value: \`${userToAdd.username.toLowerCase()}\``,
      };

      expect(response.body.error).toEqual(expectedError);
    });

    test("(Test unique validator) When username ('sample@example.com') already exists in database, return json with error Error, expected `email` to be unique. Value: `sample@example.com` message", async () => {
      const userToAdd = {
        username: "Sample2",
        name: "SampleName2",
        email: "sample@example.com",
        password: "SamplePassword2",
      };

      await usersTestUtils.addUserToDb(usersTestUtils.sampleUserInDb1);

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);

      const expectedError = {
        email: `Error, expected \`email\` to be unique. Value: \`${userToAdd.email.toLowerCase()}\``,
      };

      expect(response.body.error).toEqual(expectedError);
    });

    test("When password is missing, return json with error `password` is required message", async () => {
      const userToAdd = {
        username: "Sample",
        name: "SampleName",
        email: "sample@example.com",
      };

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);
      expect(response.body.error).toBe("`password` is required.");
    });

    test("When password is less than 8 characters long, return json with error Password has to be at least 8 characters long message", async () => {
      const userToAdd = {
        username: "Sample",
        name: "SampleName",
        email: "sample@example.com",
        password: "123456",
      };

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();

      expect(usersInDb).toHaveLength(initialUsersInDb.length);
      expect(response.body.error).toBe(
        "Password has to be at least 8 characters long."
      );
    });

    test("When request is valid, number of users in database increment by 1", async () => {
      const userToAdd = {
        username: "Sample",
        name: "SampleName",
        email: "sample@example.com",
        password: "SamplePassword",
      };

      const initialUsersInDb = await usersTestUtils.usersInDb();

      const response = await api
        .post("/api/users/")
        .send(userToAdd)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const usersInDb = await usersTestUtils.usersInDb();
      expect(usersInDb).toHaveLength(initialUsersInDb.length + 1);

      // Lowercase as the username and email fields when are converted to lowercase before inserting into database.
      const expectedUser = {
        username: "sample",
        name: "SampleName",
        email: "sample@example.com",
      };

      expect(response.body).toMatchObject(expectedUser);
    });
  });
});

afterAll(async () => {
  await databaseSetupTestUtils.resetDatabase();
  await mongoose.connection.close();
});
