<template>
  <div id="panel">
    <TopToolbar />

    <div id="masterPanel">
      <template v-if="loading">
        <LoadingPanel />
      </template>

      <template v-else-if="error">
        <ErrorPanel :error="error" />
      </template>

      <template v-else-if="exploredData.type === 'directory'">
        <FilePanel />
      </template>

      <template v-else>
        <OpenPanel :file="exploredData" />
      </template>
    </div>

    <BottomToolbar />
  </div>
</template>


<script>
import TopToolbar from '@/components/toolbars/TopToolbar'
import BottomToolbar from '@/components/toolbars/BottomToolbar'
import LoadingPanel from '@/components/panels/LoadingPanel'
import FilePanel from '@/components/panels/file-panel/FilePanel'
import OpenPanel from '@/components/panels/open-panel/OpenPanel'
import ErrorPanel from '@/components/panels/ErrorPanel'

import { mapGetters } from 'vuex'

// const DELAY_BEFORE_LOADING_CIRCLE = 200 // 200ms wait before showing loading circle
export default {
  name: 'ExploreView',
  components: {
    FilePanel,
    LoadingPanel,
    TopToolbar,
    OpenPanel,
    ErrorPanel,
    BottomToolbar
  },
  mounted() {
    // set store path from data from url
    this.routeChange(this.$router.currentRoute._value)
  },
  methods: {
    routeChange: function (route) {
      // when $router changes check if $store value matches
      // if not then the $router change was done through the browser (back/forward)
      // so we need to manualy update the $store values
      var decodedPath = decodeURIComponent(route.path)
      var newPath = decodedPath.replace('/' + route.name, '') || '/'
      if (newPath !== this.exploredPath)
        this.$store.commit('explorer/setPath', newPath)
    }
  },
  watch: {
    exploredPath(newPath) { // when store path changes, change router url
      // encode everything except '/'
      let encodedPath = encodeURIComponent(newPath)
      encodedPath = encodedPath.replaceAll('%2F', '/')
      this.$router.push('/' + this.$router.currentRoute._value.name + encodedPath)
    },
    $route(to) { // watch for browser back/forward
      this.routeChange(to)
    }
  },
  computed: {
    ...mapGetters({
      exploredData: 'explorer/data',
      exploredPath: 'explorer/path',
      error: 'explorer/error',
      loading: 'explorer/loading'
    })
  }
}
</script>

<style lang="scss">
// default text styles
* {
  color: $color-text;
  font-family: sans-serif;
  font-size: 14px;
  user-select: none;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  background-color: $color-background;
}
</style>

<style lang="scss" scoped>
#panel {
  display: block;
  width: 100%;
  height: 100%;
}

#masterPanel {
  width: 100%;
  height: calc(100% - (20px + 60px)); // 20px bottom 60px top

  box-sizing: border-box; // dont add +2px to size
  border: 1px solid $color-border;
}
</style>
