const { ACCESS_TOKEN } = require('../config.js')
const cookie = require('cookie')

module.exports = (cookies) => {
  if (ACCESS_TOKEN) { // server allows admin connections
    if (cookies) { // client has cookies
      const parsedCookies = cookie.parse(cookies)
      if (parsedCookies.Access_Token === ACCESS_TOKEN) { // auth
        return true
      }
    }
  }
  return false
}
