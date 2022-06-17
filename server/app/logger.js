
module.exports = (req, res, next) => {
  const now = new Date()
  const time = now.toLocaleTimeString()
  const method = req.method
  const path = req.path
  const json = JSON.stringify(req.body, 0, 2)

  console.log(time, method, path, json)

  next()
}
