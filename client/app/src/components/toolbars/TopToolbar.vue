<template>
  <div id="toptoolbar">
    <div id="vertialCenter">
      <div id="navigation">
        <ToolbarIcon
          class="actionIcon"
          icon="previous"
          @click="handleAction('PREVIOUS')"
          @mousedown.middle="handleAction('PREVIOUS', true)"
        />
        <ToolbarIcon
          class="actionIcon"
          icon="next"
          @click="handleAction('NEXT')"
          @mousedown.middle="handleAction('NEXT', true)"
        />
        <ToolbarIcon
          class="actionIcon"
          icon="up"
          @click="handleAction('PARENT')"
          @mousedown.middle="handleAction('PARENT', true)"
        />
      </div>
      <div id="trail">
        <div
          class="trailItem"
          v-for="(item, index) in trailItems"
          :key="item"
          @click="trailClick(index)"
          @mousedown.middle="trailClick(index, true)"
        >
          <template v-if="index == 0">
            <ToolbarIcon id="harddisk" icon="harddisk" />
          </template>
          <template v-else>
            <span>
              {{ item }}
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToolbarIcon from '@/components/icons/ToolbarIcon.vue'

import openNewWindow from '@/helpers/openNewWindow.js'

let animateScrollInterval
export default {
  name: 'TopToolbar',
  components: {
    ToolbarIcon
  },
  methods: {
    trailClick(index, newTab) {
      if (!this.path) return // path not loaded yet / api failure
      let clickedPath = this.path.split('/').slice(0, index + 1).join('/') || '/'
      if (newTab) {
        openNewWindow(clickedPath)
      } else {
        this.$store.commit('explorer/setPath', clickedPath)
      }
    },
    handleAction(action, newTab) {
      if (action === 'PREVIOUS') {
        if (newTab) { // new tab
          const back = window.history.state.back
          if (back) window.open(back, "_blank")
        } else {
          this.$router.back()
        }
      } else if (action === 'NEXT') {
        if (newTab) { // new tab
          const forward = window.history.state.forward
          if (forward) window.open(forward, "_blank")
        } else {
          this.$router.forward()
        }
      } else if (action === 'PARENT') {
        let splitted = this.path.split('/')
        let parentPath = splitted.slice(0, splitted.length - 1).join('/') || '/'
        if (newTab) { // new tab
          openNewWindow(parentPath)
        } else { 
          this.$store.commit('explorer/setPath', parentPath)
        }
      }
    },
    handleScroll(event) {
      let scrollIncrement = 80
      if (event.deltaY < 0) scrollIncrement *= -1
      clearInterval(animateScrollInterval)

      const count = 10
      const step = scrollIncrement / count
      const speed = 100 / count
      let i = 0
      animateScrollInterval = setInterval(() => {
        if (i > count)
          clearInterval(animateScrollInterval)
        i++
        document.getElementById('trail').scrollLeft += step
      }, speed)
    },
    scrollToEnd() {
      document.getElementById('trail').scrollLeft += 1_000_000 // large number
    }
  },
  mounted() {
    document.getElementById('trail').addEventListener('wheel', this.handleScroll)
  },
  unmounted() {
    document.getElementById('trail').removeEventListener('wheel', this.handleScroll)
  },
  updated() {
    this.scrollToEnd()
  },
  computed: {
    path() {
      return this.$store.state.explorer.path
    },
    trailItems() {
      // '/var/www//html' => ['var', 'www', '', 'html']
      let trailItems = this.path.split('/')
      // ['var', 'www', '', 'html'] => ['var', 'www', 'html']
      trailItems = trailItems.filter(item => item)
      // ['var', 'www', 'html'] => ['/', 'var', 'www', 'html']
      trailItems.unshift('/')

      return trailItems
    }
  }
}
</script>

<style lang="scss" scoped>
#toptoolbar {
  background-color: $color-top-toolbar;
  height: 60px; // linked to calc in ExploreView
  // width: 100%;
  position: relative;
}
#vertialCenter {
  width: 100%;
  display: flex;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
#navigation {
  margin-left: 6px;
  min-width: 140px;
}
.actionIcon {
  border-radius: 6px;
  height: 40px;
  width: 40px;
  padding: 2px;
  &:hover {
    background-color: $color-hover;
  }
  &:active {
    background-color: $color-active;
  }
}
#trail {
  display: flex;
  // width: 100%; // makes '+' float right side // depricate

  // scroll
  overflow-x: scroll;
  -ms-overflow-style: none; // Edge
  scrollbar-width: none; // Firefox
  &::-webkit-scrollbar {
    display: none;
  } // chrome
  margin-top: 5px;
  margin-right: 10px;
}
.trailItem {
  white-space: nowrap; // chrome wraps text of last item
  float: left;
  padding-left: 10px;
  padding-right: 10px;
  height: 25px;
  margin-top: 6px;
  span {
    font-size: 16px;
  }
  &:hover {
    border-bottom: 2px solid $color-pre-active;
  }
  // harddisk img icon has different formatting than divs
  &:first-child {
    margin-top: 3px;
    padding-bottom: 3px;
  }
  #harddisk {
    // harddisk img size
    height: 25px;
    width: 25px;
  }
  &:last-child {
    border-bottom: 2px solid $color-active;
    font-weight: bold;
  }
}
</style>
