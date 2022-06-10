<template>
  <PopupModal ref="popup">
    <div id="dialog" class="shadow">
      <div id="body">
        <p class="textCenter" id="title">Cancel upload?</p>
        <p class="textCenter" id="small">
          There are still files uploading, their upload will be halted if you
          close this.
        </p>
      </div>
      <div>
        <button class="actionButton" @click="cancel">Continue</button>
        <button class="actionButton" @click="confirm">Halt upload</button>
      </div>
    </div>
  </PopupModal>
</template>

<script>
import PopupModal from '../PopupModal'

export default {
  name: "DeleteDialog",
  components: {
    PopupModal
  },
  data() {
    return {
      resolvePromise: undefined,
    }
  },
  methods: {
    show() {
      // show popup
      this.$refs.popup.open()

      // return promise
      return new Promise((resolve) => {
        this.resolvePromise = resolve
      })
    },
    confirm() {
      this.$refs.popup.close()
      this.resolvePromise(true)
    },
    cancel() {
      this.$refs.popup.close()
      this.resolvePromise(false)
    }
  }
}
</script>

<style lang="scss" scoped>
#dialog {
  width: 300px;
  background-color: $color-popup;
  border-radius: 4px;
}
#body {
  padding: 25px 40px;
}
#title {
  font-weight: bold;
  font-size: 16px;
}
#small {
  margin-top: 10px;
}

button {
  border-radius: 0px;
  width: 50%;
  height: 35px;
}
</style>