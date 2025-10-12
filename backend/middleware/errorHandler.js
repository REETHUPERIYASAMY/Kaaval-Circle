// Error Handler Middleware
module.exports = (err, req, res, next) => {
  // ...error handling logic...
  res.status(500).send("Server Error");
};
