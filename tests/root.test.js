const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const root = supertest(app);

describe('Root Controller', () => {
  describe('GET request to /', () => {
    test("When request is sent, returns status code 200 with 'App is running' html content", async () => {
      const response = await root
        .get('/')
        .expect(200)
        .expect('Content-Type', /text\/html/);

      expect(response.text).toBe('<h1>App is running</h1>');
    });
  });
  describe('GET request to a non existing endpoint', () => {
    test("When request is sent, returns status code 404 and json with key error with value 'unknown endpoint'", async () => {
      const response = await root
        .get('/anunknownendpoint')
        .expect(404)
        .expect('Content-Type', /application\/json/);

      expect(response.body.error).toBe('unknown endpoint');
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
