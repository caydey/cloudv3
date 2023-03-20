<template>
  <div class="openPanelContainer">
    <div id="viewer" />
  </div>
</template>

<script>
import ePub from 'epubjs'

export default {
  name: 'ImagePanel',
  props: [
    'file'
  ],
  data() {
    return {
      book: null,
      rendition: null,
    }
  },
  mounted() {
      this.book = ePub(this.file.location);
      this.rendition = this.book.renderTo("viewer", { flow: "scrolled-doc", width: 900 });
      this.rendition.display();
  },
  beforeUnmount() {
    this.book.destroy();
  }
}
</script>

<style lang="scss">
#viewer {
  background-color: white;
  width: 100%;
  overflow: scroll;
  padding-top: 20px;
  padding-bottom: 40px
}
</style>
