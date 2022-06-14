<template>
  <div v-if="isVisible">
    <div
      class="mask"
      @click.prevent.stop="_unfocus()"
      @contextmenu.prevent.stop="_unfocus()"
    />
    <div
      id="menu"
      class="shadow"
      :class="{ invisible: invisibleMenu }"
      @contextmenu.prevent.stop
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuModal",
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
#menu {
  z-index: 11;
  position: absolute;

  display: block;
  background-color: $color-popup;

  padding: 4px 0; // top/bottom
  border-radius: 4px;
}
</style>
