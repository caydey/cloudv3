<template>
  <div v-if="isVisible">
    <PageMask @close="close" :zIndex="10">
      <div class="fixedCenter" @contextmenu.prevent.stop id="popup">
        <slot></slot>
      </div>
    </PageMask>
  </div>
</template>

<script>

import PageMask from '@/components/PageMask'

export default {
  name: "PopupModal",
  components: {
    PageMask
  },
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
