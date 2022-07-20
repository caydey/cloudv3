// static file server - production
let STATIC_HOST = '/static'

// data root - production, (docker shared volume)
let DATA_ROOT = '/data'

if (process.env.NODE_ENV === 'development') {
  // static file server - development
  STATIC_HOST = 'http://localhost:3000/static'

  // data root - development
  DATA_ROOT = process.env.DATA_ROOT
}

// local access
const READ_ONLY = (process.env.READ_ONLY === 'true')

// non local access
const NON_LOCAL_READ_ONLY = (process.env.NON_LOCAL_READ_ONLY === 'true')

// access token
const ACCESS_TOKEN = process.env.ACCESS_TOKEN

// disclose disk size
const HIDE_DISK_SIZE = (process.env.HIDE_DISK_SIZE === 'true')

module.exports = {
  STATIC_HOST,
  DATA_ROOT,
  HIDE_DISK_SIZE,
  READ_ONLY,
  NON_LOCAL_READ_ONLY,
  ACCESS_TOKEN
}
