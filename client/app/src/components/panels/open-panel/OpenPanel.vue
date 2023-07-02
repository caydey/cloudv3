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
    <template v-else-if="epubMimes.includes(file.mime)">
      <EpubPanel :file="file" />
    </template>
    <template v-else>
      <UnknownPanel :file="file" />
    </template>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
const PdfPanel = defineAsyncComponent(() =>
  import(/* webpackChunkName: 'pdf-viewer' */ "./PdfPanel")
);
const CodePanel = defineAsyncComponent(() =>
  import(/* webpackChunkName: 'code-viewer' */ "./CodePanel")
);
const EpubPanel = defineAsyncComponent(() =>
  import(/* webpackChunkName: 'epub-viewer' */ "./EpubPanel")
);

import MimeCategories from "./MimeCategories";

import VideoPanel from "./VideoPanel.vue";
import TextPanel from "./TextPanel.vue";
import ImagePanel from "./ImagePanel.vue";
import UnknownPanel from "./UnknownPanel.vue";

export default {
  name: "OpenPanel",
  components: {
    UnknownPanel,
    VideoPanel,
    TextPanel,
    ImagePanel,
    CodePanel,
    PdfPanel,
    EpubPanel,
  },
  setup() {
    return {
      videoMimes: MimeCategories.video,
      textMimes: MimeCategories.text,
      imageMimes: MimeCategories.image,
      codeMimes: MimeCategories.code,
      pdfMimes: MimeCategories.pdf,
      epubMimes: MimeCategories.epub,
    };
  },
  props: ["file"],
};
</script>
<style type="scss" scoped>
#container {
  height: 100%;
  width: 100%;
  overflow: auto;
}
</style>
