<template>
  <PopupModal ref="popup">
    <div id="dialog" class="shadow">
      <div id="container">
        <label for="accessToken">Access-Token:</label>
        <input
          @contextmenu.stop
          type="password"
          name="accessToken"
          class="inputBox"
          v-model="accessToken"
        />
      </div>
      <div class="buttons">
        <button class="actionButton" @click="save">Save</button>
      </div>
    </div>
  </PopupModal>
</template>

<script>
import PopupModal from "./PopupModal";

export default {
  name: "SettingsDialog",
  components: {
    PopupModal,
  },
  methods: {
    show() {
      this.accessToken = this.$store.getters["settings/accessToken"];
      // show popup
      this.$refs.popup.open();
    },
    close() {
      this.$refs.popup.close();
    },
    save() {
      // store adjust
      this.$store.commit("settings/setAccessToken", this.accessToken);
      // refresh websockets connection to send it the access token
      this.$store.dispatch("explorer/reloadConnection");

      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
#dialog {
  width: 350px;
  height: 200px;
  background-color: $color-popup;
  border-radius: 2px;
}
label {
  margin-right: 8px;
}
input {
  height: 20px;
  width: 225px;
}
#container {
  padding: 6px;
}
.buttons {
  position: absolute;
  width: 100%;
  bottom: 0;
}
button {
  width: 100%;
  height: 35px;
}
</style>
