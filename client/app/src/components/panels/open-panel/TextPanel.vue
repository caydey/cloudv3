<template>
  <div class="openPanelContainer">
    <span id="contents">
      <template v-if="contentsError"> ERROR </template>
      <template v-else-if="contentsLoading"> LOADING </template>
      <template v-else>
        {{ contents }}
      </template>
    </span>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'TextPanel',
  props: [
    'file'
  ],
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

<style lang="scss" scoped>
#contents {
  margin: 20px;
  display: block; // for when i want to change background color
  color: white;
  font-family: monospace;
  white-space: pre-wrap; // show newlines
  user-select: text;
}
</style>
