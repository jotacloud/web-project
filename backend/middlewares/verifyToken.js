const bcryptSecret = process.env.BCRYPT_SECRET;
const jwt = require("jsonwebtoken");
// Importação de Helpers
const getToken = require("../helpers/getToken");
const sendError = require("../helpers/errorHelper");
// Importação de utils.
const errorMessages = require("../utils/errorMessages");

const checkToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return sendError(
      res,
      errorMessages.deniedPermission.statusCode,
      errorMessages.deniedPermission.message
    );
  }

  const token = getToken(req);

  if (!token) {
    return sendError(
      res,
      errorMessages.deniedPermission.statusCode,
      errorMessages.deniedPermission.message
    );
  }
  try {
    const tokenVerified = jwt.verify(token, bcryptSecret);
    req.user = tokenVerified;
    next();
  } catch (error) {
    return sendError(
      res,
      errorMessages.invalidToken.statusCode,
      errorMessages.invalidToken.message
    );
  }
};

module.exports = checkToken;
