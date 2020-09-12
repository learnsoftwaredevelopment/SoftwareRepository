/**
 * The custom middlewares
 */
const logger = require("./logger");
const jwt = require("jsonwebtoken");
const config = require("./config");

const getTokenFrom = (req) => {
  const authorization = req.get("Authorization");

  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }

  return null;
};

/**
 * Middleware to protect API endpoints through token validation.
 * Returns json error message with status code 401 if token is missing or invalid.
 * If token is valid, add decodedToken Object Property to req.
 * @param {Object} req request Object
 * @param {Object} res response Object
 * @param {Function} next Function which can be called to pass controls to the next handler
 */
const tokenValidation = (req, res, next) => {
  const token = getTokenFrom(req);
  const decodedToken = !token ? null : jwt.verify(token, config.JWT_SECRET);

  // Only registered users can post to softwares API endpoint
  if (!token || !decodedToken.id) {
    return res.status(401).json({
      error: "Missing or Invalid Token",
    });
  }

  req.body.decodedToken = decodedToken;

  next();
};

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
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      error: "Invalid Token",
    });
  }

  logger.error(error.message);
  next(error);
};

module.exports = {
  unknownEndPoint,
  errorHandler,
  tokenValidation,
};
