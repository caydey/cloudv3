const CloudPath = require('../models/CloudPath.js')
const ExplorerHandler = require.main.require('./models/ExplorerHandler.js')
const isAdmin = require('../middleware/isAdmin.js')

const explorerHandler = new ExplorerHandler()

module.exports = (wss) => {
  wss.on('connection', (ws, request) => {
    // add 'admin' field to websocket object so we dont hide dot files from admins
    ws.isAdmin = isAdmin(request.headers.cookie)

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
  const hideDotFiles = !ws.isAdmin
  ws.aborter = explorerHandler.addExplorer(cloudPath, hideDotFiles, (response) => {
    ws.send(JSON.stringify(response))
  })
}
