const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');

const rootRouter = require('./routes/root');
const usersRouter = require('./routes/api/users');

const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const authRouter = require('./routes/api/auth');
const softwareRouter = require('./routes/api/software');

const app = express();

// To establish connection to database
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('App successfully connected to MongoDB');
  })
  .catch((error) => {
    logger.error('App encountered an error connecting to MongoDB', error);
  });

// The custom morgan token
const morganBodyToken = (req) => {
  const customRequestBodyLog = {
    ...req.body,
  };

  if (!req.body.password) {
    return JSON.stringify(customRequestBodyLog);
  }

  // Hide password in request body log in production environment.
  if (config.NODE_ENVIRONMENT === 'production') {
    customRequestBodyLog.password = '<hidden>';
  }

  return JSON.stringify(customRequestBodyLog);
};
morgan.token('body', morganBodyToken);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
);

// Routes
app.use(rootRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/software', softwareRouter);

app.use(middleware.unknownEndPoint);
app.use(middleware.errorHandler);

module.exports = app;
