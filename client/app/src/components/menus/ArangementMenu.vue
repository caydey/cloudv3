<template>
  <PageMask v-if="isVisible" class="mask" :zIndex="20" @close="_unfocus()">
    <div :class="{ invisible: invisibleMenu }" class="menu" id="arangementMenu">
      <!-- BY_NAME -->
      <div class="row" @click="arangementAction('ARANGE_BY_NAME')">
        <ActionIcon
          class="icon"
          :icon="sortField === 'name' ? 'radio-checked' : 'radio-unchecked'"
        />
        <span>By Name</span>
      </div>
      <!-- BY_SIZE -->
      <div class="row" @click="arangementAction('ARANGE_BY_SIZE')">
        <ActionIcon
          class="icon"
          :icon="sortField === 'size' ? 'radio-checked' : 'radio-unchecked'"
        />
        <span>By Size</span>
      </div>
      <!-- BY_DATE -->
      <div class="row" @click="arangementAction('ARANGE_BY_DATE')">
        <ActionIcon
          class="icon"
          :icon="sortField === 'modified' ? 'radio-checked' : 'radio-unchecked'"
        />
        <span>By Date</span>
      </div>

      <!-- ROW_BREAK -->
      <div class="rowBreak" />

      <!-- ASCENDING -->
      <div class="row" @click="arangementAction('ARANGE_ASCENDING')">
        <ActionIcon
          class="icon"
          :icon="sortAscending ? 'radio-checked' : 'radio-unchecked'"
        />
        <span>Ascending</span>
      </div>
      <!-- DESCENDING -->
      <div class="row" @click="arangementAction('ARANGE_DESCENDING')">
        <ActionIcon
          class="icon"
          :icon="!sortAscending ? 'radio-checked' : 'radio-unchecked'"
        />
        <span>Descending</span>
      </div>

      <!-- ROW_BREAK -->
      <div class="rowBreak" />

      <!-- FOLDERS_FIRST -->
      <div class="row" @click="arangementAction('ARANGE_FOLDERS_FIRST')">
        <ActionIcon
          class="icon"
          :icon="sortFoldersFirst ? 'checkbox-checked' : 'checkbox-unchecked'"
        />
        <span>Folders First</span>
      </div>
    </div>
  </PageMask>
</template>

<script>
import PageMask from '@/components/PageMask'
import { mapGetters } from 'vuex'

import { defineAsyncComponent } from 'vue'
const ActionIcon = defineAsyncComponent(() => import(/* webpackChunkName: 'action-icons' */ '@/components/icons/ActionIcon'))

export default {
  name: "ArangementMenu",
  components: {
    ActionIcon,
    PageMask
  },
  data() {
    return {
      resolvePromise: undefined,
      isVisible: false,
      invisibleMenu: true
    }
  },
  computed: {
    ...mapGetters({
      sortField: 'settings/sortField',
      sortAscending: 'settings/sortAscending',
      sortFoldersFirst: 'settings/sortFoldersFirst'
    }),
  },
  methods: {
    show(pos) {
      this.isVisible = true

      // give time for menu elements to load so we can get its offsetWidth/Height
      this.invisibleMenu = true
      setTimeout(() => {
        this._positionMenu(pos)
        // show menu
        this.invisibleMenu = false
      })

      // return promise
      return new Promise((resolve) => {
        this.resolvePromise = resolve
      })
    },
    arangementAction(action) {
      this.isVisible = false
      this.resolvePromise(action)
    },
    _unfocus() {
      this.isVisible = false
      this.resolvePromise(undefined)
    },
    _positionMenu(position) {
      const menuElement = document.getElementById('arangementMenu')

      const menuHeight = menuElement.offsetHeight
      const menuWidth = menuElement.offsetWidth

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      let newX = position.x + position.width;
      let newY = position.y + 85;

      if (windowHeight < newY + menuHeight)
        newY -= menuHeight;
      if (windowWidth < newX + menuWidth)
        newX -= menuWidth + position.width;

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
