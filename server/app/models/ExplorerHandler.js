const fs = require('fs-extra')

const { exploreApi, validateExplorePath } = require('./PathExplorer.js')

const { HIDDEN_FILES_CHARACTER } = require('../config.js')

/* class ExplorerHandler */
module.exports = class {
  #fileWatchers

  constructor () {
    this.#fileWatchers = new Map()
  }

  addExplorer (cloudPath, showAllFiles, callback) {
    let fileWatcher = this.#fileWatchers[cloudPath.system]
    // create new filewatcher for directory if we dont already have one
    if (!fileWatcher) {
      fileWatcher = new FileWatcher(cloudPath)
      this.#fileWatchers[cloudPath.system] = fileWatcher
    }

    const aborter = fileWatcher.addWatcher(showAllFiles, (data) => {
      callback(data)
    })
    return aborter
  }
}

const TRIGGER_DELAY = 50 // wait 50ms before triggering update
const TRIGGER_TIMEOUT = 5_000 // only trigger updates a minimum 2 second between the last
class FileWatcher {
  #watchers = new Map()
  #controller = new AbortController()
  #lastResponse = null
  #hiddenLastResponse = null
  #id = 0
  #cloudPath
  #haltTriggers = false
  #lastTrigger = 0

  constructor (cloudPath) {
    this.#cloudPath = cloudPath
  }

  #startWatching () {
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
        // wait TRIGGER_DELAY to send response, because changing a dir will result
        // in fs.watch being called up to 3 times in the span of 10ms
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.#triggerUpdate()
        }, TRIGGER_DELAY)
      })
    })
  }

  #triggerUpdate () {
    // console.log('trying triggerupdate')
    // // triggering halted untill TRIGGER_TIMEOUT finished
    // if (this.#haltTriggers) {
    //   return
    // }
    // console.log('passed triggerupdate haltTriggers check')
    // // check if it has been TRIGGER_TIMEOUT since last trigger
    // const now = Date.now()
    // if (now - this.#lastTrigger < TRIGGER_TIMEOUT) {
    //   // halt all future triggers untill TRIGGER_TIMEOUT has finished
    //   // + also send a triggerUpdate so there isnt a dangling trigger
    //   this.#haltTriggers = true // halt triggerUpdate
    //   setTimeout(() => {
    //     this.#haltTriggers = false // unhalt triggerUpdate
    //     this.#triggerUpdate() // re-trigger update
    //   }, TRIGGER_TIMEOUT - (now - this.#lastTrigger))
    //   return
    // }

    // this.#lastTrigger = now

    exploreApi(this.#cloudPath, (response) => {
      // exploreApi returned error, abort all future updates
      if (!response.success) {
        this.#controller.abort()
      }
      this.#broadcastResponse(response)
    })
  }

  #broadcastResponse (response) {
    // create response clone with the dot files hidden
    const clonedData = Object.assign({}, response.data)
    const hidFilesResponse = { success: response.success, data: clonedData }
    if (hidFilesResponse.success && hidFilesResponse.data.children) {
      hidFilesResponse.data.children = []
      hidFilesResponse.data.size = 0 // hide size that the dot files take up
      response.data.children.forEach((child) => {
        if (!child.name.startsWith(HIDDEN_FILES_CHARACTER)) { // not hidden file
          hidFilesResponse.data.children.push(child)
          hidFilesResponse.data.size += child.size
        }
      })
    }
    // update last responses
    this.#hiddenLastResponse = hidFilesResponse
    this.#lastResponse = response

    // broadcast response to all watchers
    this.#watchers.forEach(({ watcher, showAllFiles }) => {
      watcher(showAllFiles ? response : hidFilesResponse)
    })
  }

  addWatcher (showAllFiles, watcher) {
    const watcherId = this.#id
    this.#id++
    this.#watchers.set(watcherId, { watcher, showAllFiles })

    // first watcher, begin fswatch and trigger update
    if (this.#watchers.size === 1) {
      this.#startWatching()
    } else {
      // send lastest response to newly added watcher
      if (this.#lastResponse) {
        watcher(showAllFiles ? this.#lastResponse : this.#hiddenLastResponse)
      }
    }

    const aborter = () => {
      this.#watchers.delete(watcherId)
      if (this.#watchers.size === 0) {
        this.#controller.abort()
      }
    }
    return aborter
  }
}
