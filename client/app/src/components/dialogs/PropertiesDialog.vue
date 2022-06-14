<template>
  <PopupModal ref="popup">
    <div id="dialog" class="shadow">
      <div id="body">
        <div id="container">
          <div id="left">
            <p>Name</p>
            <p>Kind</p>
            <p class="multiline">Path</p>
            <p>Mimetype</p>
            <p>Modified</p>
            <p>Size</p>
          </div>
          <div id="right">
            <p>{{ item.name }}</p>
            <p>{{ item.type }}</p>
            <p class="multiline">{{ item.path }}</p>
            <p>{{ item.mime }}</p>
            <p>{{ new Date(item.modified).toLocaleString() }}</p>
            <p>{{ item.size }}</p>
          </div>
        </div>
      </div>
    </div>
  </PopupModal>
</template>

<script>
import PopupModal from './PopupModal'

import iconFromMime from '@/helpers/iconFromMime'

export default {
  name: "ErrorDialog",
  components: {
    PopupModal
  },
  data() {
    return {
      item: {},
      icon: ''
    }
  },
  methods: {
    show(item) {
      this.item = item;
      if (item.type === 'directory')
        this.icon = iconFromMime('folder')
      else
        this.icon = iconFromMime(item.mime)

      // show popup
      this.$refs.popup.open()
    },
    close() {
      this.$refs.popup.close()
    },
  }
}
</script>

<style lang="scss" scoped>
#dialog {
  background-color: $color-popup;
  border-radius: 2px;
}
#body {
  padding: 20px;
}

#container {
  width: 300px;
  margin: auto;
}

#left {
  float: left;
  margin-right: 10px;
}
.multiline {
  height: 50px;
}

button {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  border-radius: 4px;
}
</style>