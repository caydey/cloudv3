import { API_HOST } from '@/config.js'
import axios from 'axios'

export default {
  explore: (path, callback) => {
    const json = { 'path': path }
    handleApiRequest('explore', json, callback)
  },
  copy: (paths, dest, callback) => {
    const jsons = paths.map((path) => { return { 'path': path, 'dest': dest } })
    handleMultiRequest('copy', jsons, callback)
  },
  move: (paths, dest, callback) => {
    const jsons = paths.map((path) => { return { 'path': path, 'dest': dest } })
    handleMultiRequest('move', jsons, callback)
  },
  delete: (paths, callback) => {
    const jsons = paths.map((path) => { return { 'path': path, 'recursive': true } })
    handleMultiRequest('delete', jsons, callback)
  },
  mkdir: (path, callback) => {
    const json = { 'path': path }
    handleApiRequest('mkdir', json, callback)
  },

  upload: (path, file, onProgress, callback) => {
    // todo delete on cancel
    const controller = new AbortController() // allow cancelation
    const formData = new FormData()
    formData.append('files', file)
    axios.post(
      `${API_HOST}/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { 'path': path },
        signal: controller.signal,
        onUploadProgress: (event) => {
          let progressPercent = Math.floor((event.loaded / event.total) * 100)
          onProgress(progressPercent)
        }
      }
    ).then((res) => {
      if (res.data.success === false)
        return callback(res.data.message || 'api error')
      callback(undefined, res.data.data)
    }).catch((err) => {
      callback(err.message) // axios error message
    })
    return controller
  }
}

function handleMultiRequest(apiFunction, jsonRequests, callback) {
  const iterfunc = ((index) => {
    if (index >= jsonRequests.length) { // completed
      return callback(undefined)
    }
    handleApiRequest(apiFunction, jsonRequests[index], (err) => {
      if (err) {
        console.log(err);
        return callback(err)
      }
      iterfunc(index + 1)
    })
  })
  iterfunc(0)
}

function handleApiRequest(apiFunction, json, callback) {
  axios.post(`${API_HOST}/${apiFunction}`, json).then((res) => {
    // api wrong param error
    if (res.data.success === false)
      return callback(res.data.message || 'api error')
    callback(undefined, res.data.data)
  }).catch((err) => {
    console.log(err);
    callback(err.message) // axios error message
  })
}