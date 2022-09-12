export default function(mimetype) {
  if (mimetype === 'folder')
    return require('@/assets/places/folder.svg')

  let svgname = mimetype.replaceAll('/', '-')
  try {
    return require(`@/assets/mimetypes/${svgname}.svg`)
  } catch (error) {
    return require('@/assets/mimetypes/unknown.svg')
  }
}