<template>
  <div
    id="panelitem"
    @click="itemClick"
    @mousedown.middle="itemMiddleClick"
    :class="{
      zoomNeg2: zoomLevel === -2,
      zoomNeg1: zoomLevel === -1,
      zoom0: zoomLevel === 0,
      zoomPos1: zoomLevel === 1,
      zoomPos2: zoomLevel === 2,
    }"
  >
    <div>
      <img id="icon" draggable="false" :src="fileicon" />
    </div>
    <p>
      {{ item.name }}
    </p>
  </div>
</template>

<script>
import iconFromMime from '@/helpers/iconFromMime'

import openNewWindow from '@/helpers/openNewWindow'

import { mapGetters } from 'vuex'
export default {
  name: 'PanelItem',
  props: [
    'item',
    'focused'
  ],
  data() {
    return {
      fileicon: ''
    }
  },
  methods: {
    itemClick() {
      this.$store.commit('explorer/setPath', this.item.path)
    },
    itemMiddleClick() {
      openNewWindow(this.item.path)
    }
  },
  mounted() {
    let mimetype = this.item.mime;
    if (this.item.type === 'directory') mimetype = 'folder'
    this.fileicon = iconFromMime(mimetype)
  },
  computed: {
    ...mapGetters({
      zoomLevel: 'settings/zoomLevel',
    }),
  }
}
</script>

<style lang="scss" scoped>
#panelitem {
  display: block;
  float: left;
  border-radius: 10px;
  margin: 2px;
  padding-top: 8px;

  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  text-align: center;
  p {
    position: relative; // allow z-index
    // inherit not $color-hover for when color gets highlighted in FilePanel
    background-color: inherit;
  }
  &:hover {
    background-color: $color-hover;
    position: relative;
    overflow: visible;
    p {
      border-radius: 10px;
      z-index: 1;
    }
  }
}
#panelitem:active {
  background-color: $color-active;
}

.zoomNeg2 {
  width: 60px;
  height: 100px;
  #icon {
    width: 30px;
  }
}
.zoomNeg1 {
  width: 80px;
  height: 120px;
  #icon {
    width: 50px;
  }
}
.zoom0 {
  width: 100px;
  height: 160px;
  #icon {
    width: 70px;
  }
}
.zoomPos1 {
  width: 120px;
  height: 200px;
  #icon {
    width: 100px;
  }
}
.zoomPos2 {
  width: 140px;
  height: 240px;
  #icon {
    width: 130px;
  }
}
</style>
