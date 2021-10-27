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
  try {
    const token = getReqAuthToken(req);

    const decodedToken = await verifyAuthToken(token, true);

    if (!decodedToken) {
      return res.status(401).json({
        error: 'Missing/Invalid Token',
      });
    }

    req.body.decodedToken = decodedToken;

    next();
  } catch (err) {
    let error = null;
    if (err.code === 'auth/id-token-revoked') {
      error = 'Token has been revoked. Please reauthenticate.';
    } else {
      error = 'Invalid Token';
    }
    return res.status(401).json({
      error,
    });
  }
};

const unknownEndPoint = (req, res) => {
  res.status(404).json({
    error: 'unknown endpoint',
  });
};

const disabledAPIEndPoint = (req, res) => {
  res.status(403).json({
    error: 'API endpoint disabled',
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
  disabledAPIEndPoint,
};
