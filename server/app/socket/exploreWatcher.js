const CloudPath = require('../models/CloudPath.js')
const ExplorerHandler = require.main.require('./models/ExplorerHandler.js')

const explorerHandler = new ExplorerHandler()

module.exports = (wss) => {
  wss.on('connection', (ws) => {
    ws.on('message', (event) => {
      // stop receiving updates on old path
      if (ws.aborter) {
        ws.aborter()
      }

      const cloudPath = new CloudPath(event.toString())
      registerWatcher(ws, cloudPath)
    })
    ws.on('close', () => {
      if (ws.aborter) {
        ws.aborter()
      }
    })
  })
}

function registerWatcher (ws, cloudPath) {
  ws.aborter = explorerHandler.addExplorer(cloudPath, (response) => {
    ws.send(JSON.stringify(response))
  })
}
