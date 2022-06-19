<template>
  <PopupModal ref="popup">
    <div id="dialog" class="shadow">
      <div id="body">
        <p id="title">{{ title }}</p>
        <p id="message">{{ message }}</p>
      </div>
      <button class="actionButton" @click="close">Close</button>
    </div>
  </PopupModal>
</template>

<script>
import PopupModal from './PopupModal'

export default {
  name: "ErrorDialog",
  components: {
    PopupModal
  },
  data() {
    return {
      title: '',
      message: ''
    }
  },
  methods: {
    show(opts) {
      this.title = opts.title;
      this.message = opts.message;
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
  width: 400px;
  height: 140px;
  background-color: $color-popup;
  border-radius: 2px;
}
#body {
  padding: 20px;
  text-align: center;
}
#message {
  font-size: 12px;
}
#title {
  margin-bottom: 6px;
  font-weight: bold;
  font-size: 18px;
}

button {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;

  border-radius: 4px;
}
</style>