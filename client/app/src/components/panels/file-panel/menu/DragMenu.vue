<template>
  <MenuModal ref="menu">
    <!-- COPY -->
    <div class="row" @click="dragAction('COPY')">
      <ActionIcon class="icon" icon="folder-copy" />
      <span>Copy here</span>
    </div>

    <!-- MOVE -->
    <div class="row" @click="dragAction('MOVE')">
      <ActionIcon class="icon" icon="folder-move" />
      <span>Move here</span>
    </div>

    <div class="rowBreak"></div>
    <!-- CANCEL -->
    <div class="row" @click="dragAction('CANCEL')">
      <ActionIcon class="icon" icon="cancel" />
      <span>Cancel</span>
    </div>
  </MenuModal>
</template>

<script>
import MenuModal from './MenuModal.vue'
import { defineAsyncComponent } from 'vue'

const ActionIcon = defineAsyncComponent(() => import(/* webpackChunkName: 'action-icons' */ '@/components/icons/ActionIcon'))

export default {
  name: "DragMenu",
  components: {
    MenuModal,
    ActionIcon
  },
  data() {
    return {
      resolvePromise: undefined
    }
  },
  methods: {
    show(opts) {
      this.$refs.menu.open(opts.cursorPos)

      // send response to promise when context menu closed from MenuModal
      this.$refs.menu.onunfocus = () => {
        this.resolvePromise('CANCEL')
      }

      // return promise
      return new Promise((resolve) => {
        this.resolvePromise = resolve
      })
    },
    dragAction(action) {
      this.resolvePromise(action)
      this.$refs.menu.close()
    }
  }
};
</script>

<style lang="scss">
// change color of svg
.disabled path {
  color: $color-text-disabled;
}
</style>

<style lang="scss" scoped>
.rowBreak {
  margin: 2px 0; // top/bottom
  padding: 0;
  border: 1px solid $color-border;
}

.row {
  display: block;
  padding: 2px 6px; // top/bottom left/right
  margin: 0;
  &:hover {
    background-color: $color-active;
  }
}
.disabled {
  span {
    color: $color-text-disabled;
  }
  &:hover {
    background-color: $color-popup;
  }
}

.icon {
  position: relative;
  top: 2px; // move icon down 2 pixels
  margin-right: 8px;
}
</style>
