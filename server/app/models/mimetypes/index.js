const mime = require('mime')
const custom = require('./custom')

// apply custom mimetypes
custom(mime)

module.exports = mime
