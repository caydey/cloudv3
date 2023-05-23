<template>
  <div id="searchBarContainer" v-show="shown">
    <input
      ref="inputBox"
      type="text"
      v-model="text"
      @keydown="onKeyDown"
      @mousedown.stop
      @blur="lostFocus"
    />
  </div>
</template>

<script>
const ACTION_SEARCH = "SEARCH";
const ACTION_EXIT = "EXIT";
const ACTION_ENTER = "ENTER";

const TIMEOUT = 5_000;

export default {
  name: "SearchBar",
  data() {
    return {
      text: this.intialCharacter,
      listener: null,
      shown: false,
      killTimer: null,
    };
  },
  methods: {
    resetTimeout() {
      clearTimeout(this.killTimer);
      this.killTimer = setTimeout(() => {
        this.lostFocus();
      }, TIMEOUT);
    },
    begin(initialChar, listener) {
      this.resetTimeout();

      this.shown = true;
      this.text = initialChar;
      // give time for box to be rendered before focusing
      setTimeout(() => {
        this.$refs.inputBox.focus();
      }, 10);
      this.listener = listener;
      this.listener({ action: ACTION_SEARCH, search: initialChar });
    },
    onKeyDown(e) {
      // update timer
      this.resetTimeout();

      // controll key presses
      if (e.key === "Escape") {
        return this.lostFocus();
      }
      if (e.key === "Enter") {
        this.listener({ action: ACTION_ENTER });
        return this.lostFocus();
      }

      // keydown is faster than v-models this.text is updated,
      // this.$nextTick should solve that however is very inconsistent
      // 50ms delay further improves the consistency
      this.$nextTick(() => {
        setTimeout(() => {
          this.listener({ action: ACTION_SEARCH, search: this.text });
        }, 50);
      });
    },
    lostFocus() {
      // sometimes this can be called twice
      if (this.shown === false) return;

      this.shown = false;
      this.listener({ action: ACTION_EXIT });
      this.listener = null;
    },
  },
};
</script>

<style lang="scss" scoped>
#searchBarContainer {
  position: fixed;
  right: 6px;
  bottom: 6px;
  z-index: 10;
}
#searchBarContainer > input {
  // color: black;
  padding: 4px;
  background-color: $color-background;
}
</style>
