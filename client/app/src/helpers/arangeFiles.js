import naturalCompare from "natural-compare"

// sort folders first then files
export default function(children, options) {
  let files = []
  let folders = []
  children.forEach(item => {
    // segegrate files and folders if we want them to be sorted individualy
    if (options.foldersFirst) {
      if (item.type === 'directory') {
        folders.push(item)
      } else {
        files.push(item)
      }
    } else { // mix files and folders in sort
      files.push(item)
    }
  })

  let sortField = options.field
  // if sorting by time, use different method
  if (sortField === 'modified') {
    folders.sort((a, b) => new Date(a.modified) - new Date(b.modified))
    files.sort((a, b) => new Date(a.modified) - new Date(b.modified))
  } else {
    folders.sort((a,b) => naturalCompare(a[sortField], b[sortField]))
    files.sort((a,b) => naturalCompare(a[sortField], b[sortField]))
  }

  // descending sort
  if (!options.ascending) {
    folders.reverse()
    files.reverse()
  }

  let sortedChildren = folders.concat(files)
  return sortedChildren
}
