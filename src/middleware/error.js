function errorHandler(err, req, res, next) {
  req.log?.error({ err }, "Unhandled error");

  const status = err.statusCode || 500;
  res.status(status).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = { errorHandler };
