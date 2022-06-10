const apiExplore = require('./api/explore.js')
const apiDelete = require('./api/delete.js')
const apiCopyMove = require('./api/copyMove.js')
const apiMkdir = require('./api/mkdir.js')
const apiUpload = require('./api/upload.js')

const accessController = require('./middleware/accessController.js')

const routes = ((route) => {
  route.use(
    '/api/explore',
    accessController('EXPLORE'),
    apiExplore.router
  )

  route.use(
    '/api/mkdir',
    accessController('MKDIR'),
    apiMkdir.router
  )
  
  route.use(
    '/api/delete',
    accessController('DELETE'),
    apiDelete.router
  )
  
  route.use(
    '/api/upload',
    accessController('UPLOAD'),
    apiUpload.router
  )

  route.use('/api/move',
    [
      (req, res, next) => {
        req.action = 'MOVE'
        next()
      },
      accessController('MOVE')
    ],
    apiCopyMove.router
  )

  route.use('/api/copy',
    [
      (req, res, next) => {
        req.action = 'COPY'
        next()
      },
      accessController('COPY')
    ],
    apiCopyMove.router
  )
})

module.exports = routes
