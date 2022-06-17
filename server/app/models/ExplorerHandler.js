const fs = require('fs-extra')

const { exploreApi, validateExplorePath } = require('./PathExplorer.js')

/* class ExplorerHandler */
module.exports = class {
  #fileWatchers

  constructor () {
    this.#fileWatchers = new Map()
  }

  addExplorer (cloudPath, callback) {
    let fileWatcher = this.#fileWatchers[cloudPath.system]
    // create new filewatcher for directory if we dont already have one
    if (!fileWatcher) {
      fileWatcher = new FileWatcher(cloudPath)
      this.#fileWatchers[cloudPath.system] = fileWatcher
    }

    const aborter = fileWatcher.addWatcher((data) => {
      callback(data)
    })
    return aborter
  }
}

const TRIGGER_TIMEOUT = 50
class FileWatcher {
  #watchers = new Map()
  #controller = new AbortController()
  #lastResponse = null
  #id = 0
  #cloudPath

  constructor (cloudPath) {
    this.#cloudPath = cloudPath
  }

  #startWatching () {
    // wait TRIGGER_TIMEOUT to send response, because changing a dir will result
    // in fs.watch being called up to 3 times in the span of 10ms
    validateExplorePath(this.#cloudPath, (errMessage) => {
      if (errMessage) {
        return this.#broadcastResponse({
          success: false,
          message: errMessage
        })
      }

      this.#triggerUpdate()
      let timer
      fs.watch(this.#cloudPath.system, this.#controller.signal, () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.#triggerUpdate()
        }, TRIGGER_TIMEOUT)
      })
    })
  }

  #triggerUpdate () {
    exploreApi(this.#cloudPath, (response) => {
      // exploreApi returned error, abort all future updates
      if (!response.success) {
        this.#controller.abort()
      }
      this.#broadcastResponse(response)
    })
  }

  #broadcastResponse (response) {
    this.#lastResponse = response
    this.#watchers.forEach((watcher) => watcher(response))
  }

  addWatcher (watcher) {
    const watcherId = this.#id
    this.#id++
    this.#watchers.set(watcherId, watcher)

    // first watcher, begin fswatch and trigger update
    if (this.#watchers.size === 1) {
      this.#startWatching()
    } else {
      // send lastest response to newly added watcher
      if (this.#lastResponse) {
        watcher(this.#lastResponse)
      }
    }

    const aborter = () => {
      delete this.#watchers.delete(watcherId)
      if (this.#watchers.size === 0) {
        this.#controller.abort()
      }
    }
    return aborter
  }
}
