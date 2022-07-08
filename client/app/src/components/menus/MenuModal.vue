<template>
  <PageMask v-if="isVisible" @close="_unfocus" :zIndex="10">
    <div
      id="menu"
      class="menu"
      :class="{ invisible: invisibleMenu }"
      @contextmenu.prevent.stop
    >
      <slot></slot>
    </div>
  </PageMask>
</template>

<script>
import PageMask from '@/components/PageMask'
export default {
  name: "MenuModal",
  components: {
    PageMask
  },
  data() {
    return {
      isVisible: false,
      invisibleMenu: true,
      onunfocus: null
    }
  },
  methods: {
    open(cursorPos = { x: 0, y: 0 }) {
      this.isVisible = true

      // give time for menu elements to load so we can get its offsetWidth/Height
      this.invisibleMenu = true
      setTimeout(() => {
        this._positionMenu(cursorPos)
        // show menu
        this.invisibleMenu = false
      })
    },
    close() {
      this.isVisible = false
      this.invisibleMenu = true
    },
    getMenuSize() {
      return document.getElementById('menu').getBoundingClientRect()
    },
    _unfocus() {
      if (this.onunfocus)
        this.onunfocus()
      this.close()
    },
    _positionMenu(position) {
      const menuElement = document.getElementById('menu')

      const menuHeight = menuElement.offsetHeight
      const menuWidth = menuElement.offsetWidth

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      let newX = position.x;
      let newY = position.y;

      if (windowHeight < newY + menuHeight)
        newY -= menuHeight;
      if (windowWidth < newX + menuWidth)
        newX -= menuWidth;

      menuElement.style.left = `${newX}px`
      menuElement.style.top = `${newY}px`
    }
  }
};
</script>

<style lang="scss" scoped>
.invisible {
  visibility: hidden;
}
</style>
