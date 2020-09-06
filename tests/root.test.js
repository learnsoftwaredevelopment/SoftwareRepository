const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const root = supertest(app);

describe("Tests the root endpoint", () => {
  test("test get root should return status code 200 and server is running html content", async () => {
    const response = await root
      .get("/")
      .expect(200)
      .expect("Content-Type", /text\/html/);

    expect(response.text).toBe("<h1>App is running</h1>");
  });

  test("test non existing url should return status code 404 and json error unknown endpoint", async () => {
    const response = await root
      .get("/anunknownendpoint")
      .expect(404)
      .expect("Content-Type", /application\/json/);

    expect(response.body.error).toBe("unknown endpoint");
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
