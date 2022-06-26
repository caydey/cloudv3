<template>
  <div id="bottomtoolbar">
    <template v-if="loading">
      <span> Loading... </span>
    </template>
    <template v-else>
      <span>
        {{ contents }}
      </span>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import bytesToHuman from '@/helpers/bytesToHuman.js'

export default {
  name: 'BottomToolbar',
  methods: {
    formatBytes(bytes) {
      let bytesHuman = `${bytes.toLocaleString()} byte`
      bytesHuman += ((bytes == 1) ? '' : 's')
      let sizeStats = `${bytesHuman}`
      if (bytes >= 1024) { // < 1024 bytes
        let sizeHuman = bytesToHuman(bytes)
        sizeStats = `${sizeHuman} (${bytesHuman})`
      }
      return sizeStats
    },
    millisecondsToHuman(milli) {
      const steps = [60, 24, 7, 52, 100]
      const units = ['m', 'h', 'd', 'w', 'y']

      const skip = 1_000 * 60 // miliseconds and seconds
      let time = Math.floor(milli / skip)
      let human = ''
      let rem = 0
      for (let i = 0; i < steps.length; i++) {
        rem = time % steps[i]
        time = Math.floor(time / steps[i])
        if (rem > 0)
          human = `${rem}${units[i]} ${human}`
      }
      return human
    },
    getDirectoryStats(exploredData) {
      // 2.8 KiB (2,832 bytes)
      let sizeStats = this.formatBytes(exploredData.size)
      // 3 folders, 5 files
      let files = 0
      let folders = 0
      exploredData.children.forEach(child => {
        if (child.type === 'directory')
          folders++
        else
          files++
      });
      let fileString = `${files} file` + ((files == 1) ? '' : 's')
      let folderString = `${folders} folder` + ((folders == 1) ? '' : 's')
      let fileFolderStats = `${folderString}, ${fileString}`
      if (files == 0 && folders == 0)
        fileFolderStats = '0 items'
      else if (folders == 0)
        fileFolderStats = `${fileString}`
      else if (files == 0)
        fileFolderStats = `${folderString}`

      // free space hidden
      if (exploredData.free === -1)
        return `${fileFolderStats}: ${sizeStats}`

      // Free space 16.0 GiB
      let freeSpace = `Free space: ${bytesToHuman(exploredData.free)}`
      return `${fileFolderStats}: ${sizeStats}, ${freeSpace}`
    },
    getFileStats(fileObj) {
      let sizeStats = this.formatBytes(fileObj.size)

      let lastModifiedMilli = Date.now() - new Date(fileObj.modified)
      let lastModified = this.millisecondsToHuman(lastModifiedMilli)

      let content = `File, ${sizeStats},  modified: ${lastModified} ago, mime: ${fileObj.mime}`
      return content
    }
  },
  computed: {
    ...mapGetters({
      loading: 'explorer/loading'
    }),
    contents() {
      const exploredData = this.$store.state.explorer.data
      if (exploredData.type === 'directory') {
        return this.getDirectoryStats(exploredData)
      } else if (exploredData.type === 'file') {
        return this.getFileStats(exploredData)
      }
      return ""
    }
  }
}

</script>

<style lang="scss" scoped>
#bottomtoolbar {
  background-color: $color-bottom-toolbar;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  overflow: hidden;
  span {
    display: block;
    // vertically center
    position: absolute;
    top: 50%;
    transform: translateY(-50%);

    padding-left: 12px;
    font-size: 14px;

    white-space: nowrap; // dont wrap
  }
}
</style>
