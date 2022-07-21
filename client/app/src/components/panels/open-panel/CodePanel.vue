<template>
  <span v-if="contentsError">ERROR</span>
  <span v-else-if="contentsLoading">
    <template v-if="showLoading"> LOADING </template>
  </span>
  <highlightjs
    v-else
    class="openPanelContainer"
    id="code"
    autodetect
    :code="contents"
  />
</template>

<script>
import 'highlight.js/styles/github-dark-dimmed.css'
import 'highlight.js/lib/common'
import hljsVuePlugin from "@highlightjs/vue-plugin";

import axios from 'axios'
export default {
  name: 'CodePanel',
  props: [
    'file'
  ],
  components: {
    highlightjs: hljsVuePlugin.component
  },
  data() {
    return {
      contents: null,
      contentsLoading: true,
      showLoading: false,
      contentsError: false
    }
  },
  methods: {
    updateContents() {
      this.contentsLoading = true
      // only show 'LOADING' after 1 second of loading
      const showLoadingTimeout = setTimeout(() => {
        this.showLoading = true
        console.log("load");
      }, 200)

      axios.get(encodeURI(this.file.location), {
        responseType: 'blob'
      }).then((response) => {
        response.data.text().then(text => { // parse Blob to String
          this.contents = text
          clearTimeout(showLoadingTimeout)
          this.contentsLoading = false
        })
      }).catch(() => {
        this.contentsError = true
      })
    }
  },
  watch: {
    file() { // file changed / modified
      this.updateContents()
    }
  },
  mounted() {
    this.updateContents()
  }
}
</script>


<style lang="scss">
// Not scoped so it can affect highlightjs containers
#code * {
  font-family: monospace;
}
</style>
