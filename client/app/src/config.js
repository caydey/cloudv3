// production
let API_HOST = '/api'

let SOCKET_HOST = `ws://${window.location.host}/socket`
// use wss if we are using https
if (window.location.protocol === "https:")
  SOCKET_HOST = `wss://${window.location.host}/socket`


// development
if (process.env.NODE_ENV === 'development') {
  API_HOST = 'http://localhost:3000/api'
  SOCKET_HOST = 'ws://localhost:3000/socket'
}

module.exports = {
  API_HOST,
  SOCKET_HOST
}
