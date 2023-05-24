<template>
  <div>
    <div
      class="mask"
      @click.stop="_close()"
      @contextmenu.stop.prevent="_close()"
      @mousedown.stop
      @keydown.stop
      :style="{ 'z-index': zIndex }"
    >
      <div
        @click.stop
        @drop.stop
        @dragover.stop
        @dragleave.stop
        @contextmenu.stop.prevent
        :style="{ 'z-index': zIndex + 1 }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageMask",
  props: {
    zIndex: {
      type: Number,
      default: 10,
    },
  },
  methods: {
    _close() {
      this.$emit("close");
    },
  },
  mounted() {
    // add keydown event listener for 'Esc' key presses
    document.onkeydown = (event) => {
      if (event.key === "Escape") {
        this._close();
      }
    };
  },
  unmounted() {
    // remove keydown event listener
    document.onkeydown = null;
  },
};
</script>
