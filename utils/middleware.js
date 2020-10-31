/**
 * The custom middlewares
 */
const logger = require('./logger');
const { getReqAuthToken, verifyAuthToken } = require('./jwtUtils');

/**
 * Middleware to protect API endpoints through token validation.
 * Returns json error message with status code 401 if token is missing, invalid
 * or user id in payload is invalid.
 * If token is valid and user id is valid, add decodedToken Object Property to req.
 * @param {Object} req request Object
 * @param {Object} res response Object
 * @param {Function} next Function which can be called to pass controls to the next handler
 */
const tokenValidation = async (req, res, next) => {
  const token = getReqAuthToken(req);
  const decodedToken = await verifyAuthToken(token);

  if (!decodedToken) {
    return res.status(401).json({
      error: 'Missing or Invalid Token',
    });
  }

  req.body.decodedToken = decodedToken;

  next();
};

const unknownEndPoint = (req, res) => {
  res.status(404).json({
    error: 'unknown endpoint',
  });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    const errorObject = {};
    Object.values(error.errors).forEach(({ properties }) => {
      errorObject[properties.path] = properties.message;
    });
    return res.status(400).json({ error: errorObject });
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid Token',
    });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({
      error: 'Malformatted id',
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
