const { NON_LOCAL_READ_ONLY } = require('../config.js')

module.exports = (method) => {
  return function (req, res, next) {
    // skip if development
    if (process.env.NODE_ENV === 'development')
      return next()
    
    // if we allow non local addresses to read/write
    if (!NON_LOCAL_READ_ONLY)
      return next()
    
    // allow read only methods
    if (method === 'EXPLORE')
      return next()
    
    // check if local
    const clientIp = req.headers['x-forwarded-for']

    if (!clientIp || !isIpPublic(clientIp)) // not local
      return res.status(403).send({
        'success': false,
        'message': 'permission denied! read only access allowed.'
      })
    
    next()
  }
}

function isIpPublic(ip) {
  // https://www.npmjs.com/package/ip
  return /^10\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip)
    || /^192\.168\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip)
    || /^172\.(1[6-9]|2\d|30|31)\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip)
    || /^127\.([0-9]{1,3})\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip)
    || /^169\.254\.([0-9]{1,3})\.([0-9]{1,3})$/i.test(ip)
} 