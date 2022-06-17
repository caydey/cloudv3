const WebSocket = require('ws')

const ping = require('./ping.js')
const exploreWatcher = require('./exploreWatcher.js')

/*
we store data on the 'ws' object just like how 'ping.js' does with isAlive
*/
module.exports = (server) => {
  const wss = new WebSocket.Server({
    noServer: true,
    path: '/socket'
  })

  // emmit connection when user connects to socket
  server.on('upgrade', (request, socket, head) => {
    if (request.headers.upgrade.toLowerCase() === 'websocket') {
      wss.handleUpgrade(request, socket, head, (socket) => {
        wss.emit('connection', socket, request)
      })
    }
  })

  // setup pinging that will close dead clients
  ping(wss)

  // handle explorer requests (every request)
  exploreWatcher(wss)
}
