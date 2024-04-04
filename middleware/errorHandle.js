const pageNotFound = (req, res, next) => {
  //   const error = new Error(`);
  return res.status(404).send(`Page Not Found - ${req.originalUrl}`);
  //   next(error);
};

module.exports = { pageNotFound };
