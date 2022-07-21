module.exports = (mime) => {
  mime.define({ 'application/x-mswinurl': ['url'] })
  mime.define({ 'text/x-c++': ['cpp'] })
  mime.define({ 'text/x-csharp': ['cs'] })
  mime.define({ 'text/x-kotlin': ['kt'] })
  mime.define({ 'text/x-log': ['log'] })
  mime.define({ 'text/x-python': ['py'] })
  mime.define({ 'text/x-script': ['sh'] })
  mime.define({ 'x-office-presentation': ['pptx'] })
}
