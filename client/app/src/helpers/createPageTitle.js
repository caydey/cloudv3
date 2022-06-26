// sort folders first then files
export default function(path, options) {
  options;

  let displayedPath = path
  if (!options.fullPath) {
    const pathSplit = path.split('/')
    displayedPath = pathSplit[pathSplit.length - 1] || '/'

  }

  let title = displayedPath
  if (options.showHeader) {
    title = `Cloudv3 - ${title}`
  }

  return title
}
