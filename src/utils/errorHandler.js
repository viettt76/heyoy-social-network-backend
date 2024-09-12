const errorHandler = (error, req, res, next) => {
  console.log(error?.message);
  return res.status(error.status || 500).json({
    success: false,
    message: error?.message || 'Error from server',
  });
};

module.exports = {
  errorHandler,
};
