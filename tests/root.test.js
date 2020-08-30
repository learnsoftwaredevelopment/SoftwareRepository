const app = require("../app");
const supertest = require("supertest");

const root = supertest(app);

describe("Tests the root endpoint", () => {
  test("test get root should return status code 200 and server is running html content", async () => {
    const response = await root
      .get("/")
      .expect(200)
      .expect("Content-Type", /text\/html/);
    expect(response.text).toBe("<h1>App is running</h1>");
  });
});
