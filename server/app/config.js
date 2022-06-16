// static file server - production
var STATIC_HOST = '/static'

// data root - production, (docker shared volume)
var DATA_ROOT = '/data'

if (process.env.NODE_ENV === 'development') {
  // static file server - development
  STATIC_HOST = 'http://localhost:3000/static'

  // data root - development
  DATA_ROOT = process.env.DATA_ROOT  
}

// non local access
var NON_LOCAL_READ_ONLY = (process.env.NON_LOCAL_READ_ONLY === 'true')

// disclose free space
var HIDE_DISK_SIZE = (process.env.HIDE_DISK_SIZE === 'true')

module.exports = {
  STATIC_HOST,
  NON_LOCAL_READ_ONLY,
  DATA_ROOT,
  HIDE_DISK_SIZE
}