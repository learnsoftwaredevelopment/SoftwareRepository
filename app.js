const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const rootRouter = require("./controllers/root");

const app = express();

// The custom morgan token
const morganBodyToken = (req) => {
  return JSON.stringify(req.body);
};
morgan.token("body", morganBodyToken);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// Routes
app.use(rootRouter);

module.exports = app;
