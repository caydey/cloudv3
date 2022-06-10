// sort folders first then files
export default function(children) {
  let files = []
  let folders = []
  children.forEach(item => {
    if (item.type === 'directory')
      folders.push(item)
    else
      files.push(item)
  })
  files.sort((a,b) => a.name-b.name)
  folders.sort((a,b) => a.name-b.name)
  let sortedChildren = folders.concat(files)
  return sortedChildren
}
