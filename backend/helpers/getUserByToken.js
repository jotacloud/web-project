const bcryptSecret = process.env.BCRYPT_SECRET;
const jwt = require('jsonwebtoken');
const prisma = require('../libs/prisma');
const errorHelper = require('../helpers/errorHelper');
const errorMessages = require('../utils/errorMessages');

// Resgatando o usuario pelo token.
const getUserByToken = async token => {
  if (!token) {
    return sendError(
      res,
      errorMessages.deniedPermission.statusCode,
      errorMessages.deniedPermission.message
    );
  }

  const decoded = jwt.verify(token, bcryptSecret);

  const userId = decoded.id;

  const user = await prisma.prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};

module.exports = getUserByToken;