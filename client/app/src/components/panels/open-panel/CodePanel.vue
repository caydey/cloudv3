<template>
  <span v-if="contentsLoading">LOADING</span>
  <span v-else-if="contentsError">ERROR</span>
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
      contentsError: false
    }
  },
  methods: {
    updateContents() {
      this.contentsLoading = true
      axios.get(encodeURI(this.file.location)).then((response) => {
        this.contentsLoading = false
        this.contents = response.data.toString();
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
