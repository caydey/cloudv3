const ip = require('ip')

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
    if (!clientIp || ip.isPublic(clientIp)) // not local
      return res.status(403).send({
        'success': false,
        'message': 'permission denied! read only access allowed.'
      })
    
    next()
  }
}