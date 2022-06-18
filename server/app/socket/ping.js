
module.exports = (wss) => {
  // on client connect
  wss.on('connection', (ws) => {
    ws.isAlive = true // added field to ws object
    // pong is what all websocket clients will respond to when send a ping
    ws.on('pong', () => {
      ws.isAlive = true
    })
  })

  /*
  every 30 seconds
  foreach client in clients
    if client is alive
      set the alive status to false
      send ping to client
      set alive status to true when pong recieved
    else
      kill client
  */
  setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive) {
        ws.isAlive = false
        ws.ping()
      } else { // dead
        ws.terminate()
      }
    })
  }, 30_000)
}
