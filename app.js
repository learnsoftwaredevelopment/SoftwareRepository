const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./utils/config");

const rootRouter = require("./controllers/root");
const usersRouter = require("./controllers/users");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

const app = express();

// To establish connection to database
mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("App successfully connected to MongoDB");
  })
  .catch((error) => {
    logger.error("App encountered an error connecting to MongoDB", error);
  });

mongoose.set("useCreateIndex", true);

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
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
