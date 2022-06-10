<template>
  <div class="openPanelContainer">
    <div v-for="i in pagesLoaded" :key="i">
      <pdf :src="pdfData" :page="i" :annotation="true" :resize="true" />
      <div class="pageBreak">
        <span>Page {{ i }} of {{ pagesTotal }}</span>
      </div>
    </div>
    <template v-if="pagesLoaded < pagesTotal">
      <button class="actionButton" id="loadmoreBtn" @click="loadMorePages">
        Load more pages
      </button>
    </template>
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
      pagesLoaded: 0
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
