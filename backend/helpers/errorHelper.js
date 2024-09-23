function sendError(res, statusCode, message) {
  res.status(statusCode).json({ message });
}

module.exports = sendError;
