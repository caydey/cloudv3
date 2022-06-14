<template>
  <div v-if="isVisible">
    <div
      class="mask"
      @click.prevent.stop="close()"
      @contextmenu.prevent.stop="close()"
    />
    <div class="fixedCenter" @contextmenu.prevent.stop id="popup">
      <slot></slot>
    </div>
  </div>
</template>

<script>

// create clipboard store
export default {
  name: "PopupModal",
  data() {
    return {
      isVisible: false,
      closeHandler: null
    }
  },
  methods: {
    open() {
      this.isVisible = true
    },
    close() {
      if (this.closeHandler) {
        this.closeHandler()
      } else {
        this.isVisible = false
      }
    },
    overrideCloseAction(closeHandler) {
      this.closeHandler = closeHandler
    }
  }
};
</script>

<style lang="scss" scoped>
#popup {
  z-index: 11;
}
</style>
