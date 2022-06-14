<template>
  <div class="openPanelContainer">
    <div
      class="zoomedView"
      @click="zoomToggled = !zoomToggled"
      :class="{ defaultView: zoomToggled }"
    >
      <div v-for="i in pagesLoaded" :key="i">
        <pdf :src="pdfData" :page="i" :annotation="true" :resize="true" />
        <div class="pageBreak">
          <span>Page {{ i }} of {{ pagesTotal }}</span>
        </div>
      </div>
      <template v-if="pagesLoaded < pagesTotal">
        <button
          class="actionButton"
          id="loadmoreBtn"
          @click.stop="loadMorePages"
        >
          Load more pages
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import pdfvuer from 'pdfvuer'

export default {
  name: 'ImagePanel',
  props: [
    'file'
  ],
  components: {
    pdf: pdfvuer,
  },
  data() {
    return {
      pagesTotal: 0,
      pdfData: undefined,
      pagesLoaded: 0,
      zoomToggled: true
    }
  },
  methods: {
    loadMorePages() {
      let pagesLoaded = this.pagesLoaded
      if (pagesLoaded === 1) // increment as 1,10,20,30 not 1,11,21,31
        pagesLoaded = 0

      pagesLoaded += 10
      if (pagesLoaded > this.pagesTotal)
        pagesLoaded = this.pagesTotal

      this.pagesLoaded = pagesLoaded
    }
  },
  mounted() {
    this.pdfData = pdfvuer.createLoadingTask(this.file.location)

    this.pdfData.then((pdf) => {
      this.pagesLoaded = 1
      this.pagesTotal = pdf.numPages
    })
  }
}
</script>

<style lang="scss" scoped>
.zoomedView {
  width: 100%;
}
.defaultView {
  margin: auto;
  width: 800px;
}
// max-width +50px for margins
@media only screen and (max-width: 850px) {
  .defaultView {
    width: 100%;
  }
}
.pageBreak {
  background-color: $color-border;
  padding: 2px;
  text-align: right;
}
#loadmoreBtn {
  font-size: 20px;
  border: none;
  width: 100%;
  height: 40px;
}
</style>
