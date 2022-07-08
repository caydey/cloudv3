const { LOCAL_READ_ONLY, NON_LOCAL_READ_ONLY, ACCESS_TOKEN } = require('../config.js')

module.exports = (req, res, next) => {
  // skip if development
  if (process.env.NODE_ENV === 'development') {
    return next()
  }

  // skip if ACCESS_TOKEN is set and correct
  if (ACCESS_TOKEN) { // VERY IMPORTANT AS ACCESS_TOKEN DEFAULT VALUE IS undefined
    if (ACCESS_TOKEN === req.headers['Access-Token']) {
      return next()
    }
  }

  let allowedAccess = true

  // LOCAL_READ_ONLY check
  if (LOCAL_READ_ONLY) {
    allowedAccess = false
  }

  // NON_LOCAL_READ_ONLY check
  const clientIp = req.headers['x-forwarded-for']
  if (NON_LOCAL_READ_ONLY && !isIpPrivate(clientIp)) {
    allowedAccess = false
  }

  if (allowedAccess) {
    return next()
  } else {
    res.status(403).send({
      success: false,
      message: 'Permission Denied! read only access allowed.'
    })
  }
}

function isIpPrivate (ip) {
  // https://www.npmjs.com/package/ip
  return /^10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
    /^192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
    /^172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
    /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip) ||
    /^169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip)
}
