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
  if (error.name === "ValidationError") {
    let errorObject = {};
    Object.values(error.errors).forEach(
      ({ properties }) => (errorObject[properties.path] = properties.message)
    );
    return res.status(400).json({ error: errorObject });
  }

  logger.error(error.message);
  next(error);
};

module.exports = {
  unknownEndPoint,
  errorHandler,
};
