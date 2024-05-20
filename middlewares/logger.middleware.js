const logger = (req, res, next) => {
  console.log(req.method, req.originalUrl, " - ", new Date());
  next();
};

export default logger;
