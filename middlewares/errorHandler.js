
const errorHandler = (err, req, res, next) => {
    
  const statusCode = err.status || err.statusCode

  res.status(statusCode || 500)
  res.json({
      status: statusCode  || 500,
      message: err.Error || 'Internal Server Error',
      stack: process.env.NODE_ENV === "production" ? null : "stack"
  });
};

module.exports = errorHandler;
