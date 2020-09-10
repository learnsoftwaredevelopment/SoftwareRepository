const app = require("../../../app");
const supertest = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const databaseSetupTestUtils = require("../../utils/databaseSetup");
const config = require("../../../utils/config");

const api = supertest(app);

beforeEach(async () => {
  await databaseSetupTestUtils.resetDatabase();

  const saltRounds = config.BCRYPT_SALT_ROUNDS;
  const passwordHash = await bcrypt.hash("SamplePassword", saltRounds);

  const userToAdd = {
    username: "Sample",
    name: "SampleName",
    email: "sample@example.com",
    passwordHash,
  };

  await databaseSetupTestUtils.addUserToDb(userToAdd);
});

describe("Login Controller", () => {
  describe("POST request to /api/login/", () => {
    test("When the username is incorrect, return status code 401 and json with error Invalid username and/or password message", async () => {
      const loginUser = {
        username: "Sampl",
        password: "SamplePassword",
      };

      const response = await api
        .post("/api/login")
        .send(loginUser)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toBe("Invalid username and/or password.");
    });

    test("When the password is incorrect, return status code 401 and json with error Invalid username and/or password message", async () => {
      const loginUser = {
        username: "Sample",
        password: "SamplePasswor",
      };

      const response = await api
        .post("/api/login")
        .send(loginUser)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toBe("Invalid username and/or password.");
    });

    test("When the username and password are incorrect, return status code 401 and json with error Invalid username and/or password message", async () => {
      const loginUser = {
        username: "Sampl",
        password: "SamplePasswor",
      };

      const response = await api
        .post("/api/login")
        .send(loginUser)
        .expect(401)
        .expect("Content-Type", /application\/json/);

      expect(response.body.error).toBe("Invalid username and/or password.");
    });

    test("When the username and password are correct, return status code 200 and json with error Invalid username and/or password message", async () => {
      const loginUser = {
        username: "Sample",
        password: "SamplePassword",
      };

      const response = await api
        .post("/api/login")
        .send(loginUser)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const expected = {
        username: loginUser.username.toLowerCase(),
        name: "SampleName",
      };

      expect(response.body).toMatchObject(expected);
    });
  });
});

afterAll(async () => {
  await databaseSetupTestUtils.resetDatabase();
  await mongoose.connection.close();
});
