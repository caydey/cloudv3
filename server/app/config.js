// static file server - production
var STATIC_HOST = '/static'
// static file server - development
if (process.env.NODE_ENV === 'development')
  STATIC_HOST = 'http://localhost:3000/static'

// data root
var DATA_ROOT = process.env.DATA_ROOT

// non local access
var NON_LOCAL_READ_ONLY = process.env.NON_LOCAL_READ_ONLY || true


module.exports = {
  STATIC_HOST,
  NON_LOCAL_READ_ONLY,
  DATA_ROOT
}