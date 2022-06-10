<template>
  <div id="container">
    <template v-if="videoMimes.includes(file.mime)">
      <VideoPanel :file="file" />
    </template>
    <template v-else-if="textMimes.includes(file.mime)">
      <TextPanel :file="file" />
    </template>
    <template v-else-if="imageMimes.includes(file.mime)">
      <ImagePanel :file="file" />
    </template>
    <template v-else-if="codeMimes.includes(file.mime)">
      <CodePanel :file="file" />
    </template>
    <template v-else-if="pdfMimes.includes(file.mime)">
      <PdfPanel :file="file" />
    </template>
    <template v-else>
      <UnknownPanel :file="file" />
    </template>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const PdfPanel = defineAsyncComponent(() => import(/* webpackChunkName: 'pdf-viewer' */ './PdfPanel'))
const CodePanel = defineAsyncComponent(() => import(/* webpackChunkName: 'code-viewer' */ './CodePanel'))

import VideoPanel from './VideoPanel.vue'
import TextPanel from './TextPanel.vue'
import ImagePanel from './ImagePanel.vue'
import UnknownPanel from './UnknownPanel.vue'


export default {
  name: 'OpenPanel',
  components: {
    UnknownPanel,
    VideoPanel,
    TextPanel,
    ImagePanel,
    CodePanel,
    PdfPanel
  },
  setup() {
    return {
      videoMimes: VideoPanel.mimes,
      textMimes: TextPanel.mimes,
      imageMimes: ImagePanel.mimes,
      codeMimes: [
        'application/javascript',
        'application/x-httpd-php',
        'application/json',
        'application/x-sh',
        'application/xml',
        'text/x-java-source',
        'text/x-c',
        'text/css',
        'text/html',
        'text/markdown',
      ],
      pdfMimes: ['application/pdf']
    }
  },
  props: [
    'file'
  ]
}
</script>
<style type="scss" scoped>
#container {
  height: 100%;
  width: 100%;
}
</style>
