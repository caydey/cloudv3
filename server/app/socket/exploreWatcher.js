const fs = require('fs-extra')
const { explorePath, validateExplorePath } = require.main.require('./api/explore.js')

const { CloudPath } = require.main.require('./models/cloud_volume.js')

const TRIGGER_MIN_TIMEOUT = 500 // minimum delay between updates

module.exports = (wss) => {
  wss.on('connection', ws => {
    ws.on('message', (event) => {
      // kill fs.watch
      abortWatcher(ws)

      ws.cloudPath = new CloudPath(event.toString())
      validateExplorePath(ws.cloudPath, (errorMessage) => {
        if (errorMessage) {
          return ws.send(JSON.stringify({
            'success': false,
            'message': errorMessage
          }))
        }
        // valid path given
        registerWatcher(ws)
        triggerExplorerUpdate(ws)
      })
    })
    ws.on('close', () => {
      abortWatcher(ws)
    })
  })
}
function abortWatcher(ws) {
  if (ws.ac) {
    ws.ac.abort()
    delete ws.ac
  }
}

function registerWatcher(ws) {
  // used to kill fs.watch
  ws.ac = new AbortController()
  const signal = ws.ac.signal
  
  ws.lastUpdate = Date.now();
  // in future maybe have some fileSystemWatcher that will merge watchers of the same directory so there isnt like 10 watcher created for the same directory that 10 users are focused on

  fs.watch(ws.cloudPath.system, { signal }, (event) => {
    let now = Date.now()
    // dont spam updates on watch events, creating a file emits 2 'change' events
    if (TRIGGER_MIN_TIMEOUT < (now - ws.lastUpdate)) {
      triggerExplorerUpdate(ws);
    }
  })
}

function triggerExplorerUpdate(ws) {
  validateExplorePath(ws.cloudPath, (errorMessage) => {
    if (errorMessage) {
      abortWatcher(ws)
      return ws.send(JSON.stringify({
        'success': false,
        'message': errorMessage
      }))
    }
    explorePath(ws.cloudPath, (err, data) => {
      if (err) {
        return ws.send(JSON.stringify({
          'success': false,
          'message': 'internal server error'
        }))
      }
      ws.send(JSON.stringify({
        'success': true,
        'data': data
      }))
    })
  })
}