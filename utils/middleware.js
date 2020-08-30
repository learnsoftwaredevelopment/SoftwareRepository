/**
 * The custom middlewares
 */
const logger = require("./logger");

const unknownEndPoint = (req, res) => {
  res.status(404).json({
    error: "unknown endpoint",
  });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  next(error);
};

module.exports = {
  unknownEndPoint,
  errorHandler,
};
