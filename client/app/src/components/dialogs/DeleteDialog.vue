<template>
  <PopupModal ref="popup">
    <div id="dialog" class="shadow">
      <div id="body">
        <p id="title">
          <template v-if="selection.length === 1">
            Are you sure that you want to permanently delete "{{
              selection[0].name
            }}"?
          </template>
          <template v-else>
            Are you sure that you want to permanently delete the
            {{ selection.length }} selected files?
          </template>
        </p>
        <p id="small">If you delete a file, it is permanently lost.</p>
      </div>
      <div>
        <button class="actionButton" @click="cancel">Cancel</button>
        <button class="actionButton" @click="confirm">Delete</button>
      </div>
    </div>
  </PopupModal>
</template>

<script>
import PopupModal from './PopupModal'

export default {
  name: "DeleteDialog",
  components: {
    PopupModal
  },
  data() {
    return {
      resolvePromise: undefined,
      selection: []
    }
  },
  methods: {
    show(selection) {
      this.selection = selection

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
  width: 400px;
  background-color: $color-popup;
  border-radius: 4px;
}
#body {
  padding: 25px 40px;
}
#title {
  font-weight: bold;
  font-size: 16px;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 100px;
}
#small {
  margin-top: 10px;
  text-align: center;
}

button {
  border-radius: 0px;
  width: 50%;
  height: 35px;
}
</style>