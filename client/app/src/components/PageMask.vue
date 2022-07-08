<template>
  <div>
    <div
      class="mask"
      @click.stop="_close()"
      @contextmenu.stop.prevent="_close()"
      @mousedown.stop
      :style="{ 'z-index': zIndex }"
    >
      <div
        @click.stop.prevent
        @contextmenu.stop.prevent
        @mousedown.stop.prevent
        :style="{ 'z-index': zIndex + 1 }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageMask',
  props: {
    'zIndex': {
      type: Number,
      default: 10
    }
  },
  methods: {
    _close() {
      this.$emit('close')
    }
  }
}
</script>
