<template>
  <div id="panelitem" :class="{ focused: focused }" @click="itemClick">
    <div>
      <img draggable="false" :src="fileicon" />
    </div>
    <p>
      {{ item.name }}
    </p>
  </div>
</template>

<script>
import iconFromMime from '@/helpers/iconFromMime'
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
    itemClick: function () {
      this.$store.commit('explorer/setPath', this.item.path)
    }
  },
  mounted() {
    let mimetype = this.item.mime;
    if (this.item.type === 'directory') mimetype = 'folder'
    this.fileicon = iconFromMime(mimetype)
  }
}
</script>

<style lang="scss" scoped>
#panelitem {
  display: block;
  float: left;
  width: 100px;
  height: 160px;
  border-radius: 10px;
  margin: 2px;
  padding-top: 8px;

  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  text-align: center;
  &:hover {
    position: relative;
    background-color: $color-hover;
    overflow: visible;
    p {
      background-color: $color-hover;
      border-radius: 10px;
      z-index: 1;
    }
  }
  p {
    position: relative; // allow z-index
  }
}
#panelitem:active,
.focused {
  background-color: $color-active;
  p {
    background-color: $color-active;
  }
}
</style>
