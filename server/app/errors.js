module.exports = (app) => {
  app.use(notFoundError)
  app.use(clientErrorHandler)
  app.use(errorHandler)
}

// error handlers
const notFoundError = function (req, res, next) {
  res.status(404).send({
    error: 'Not found',
    location: req.originalUrl,
    method: req.method
  })
}
const clientErrorHandler = function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' })
  } else {
    next(err)
  }
}
const errorHandler = function (_, req, res) {
  res.status(500).send({ error: 'Server error' })
}
