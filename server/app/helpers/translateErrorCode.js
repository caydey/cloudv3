
module.exports = (errcode) => {
  switch (errcode) {
    case 'EACCES':
      return 'Access Denied'
    case 'ENOENT':
      return 'Path does not exist'
    default:
      console.log('new error code found:', errcode)
      return 'Error'
  }
}
