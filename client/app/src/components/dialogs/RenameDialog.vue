<template>
  <PopupModal ref="popup">
    <div id="dialog" class="shadow">
      <div id="container">
        <div id="mime">
          <img :src="fileicon" />
        </div>
        <div id="body">
          <div>
            <p id="text">
              Enter the
              <template v-if="createOrRename === 'RENAME'">new</template>
              name:
            </p>
            <input
              @contextmenu.stop
              ref="fileInput"
              class="inputBox"
              type="text"
              v-on:keyup.enter="rename"
              v-model="filename"
            />
          </div>
          <div>
            <div id="buttons">
              <button class="actionButton" @click="cancel">Cancel</button>
              <button class="actionButton" @click="rename">
                {{ createOrRename === "CREATE" ? "Create" : "Rename" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PopupModal>
</template>

<script>
import PopupModal from "./PopupModal";
import iconFromMime from "@/helpers/iconFromMime";

export default {
  name: "DeleteDialog",
  components: {
    PopupModal,
  },
  data() {
    return {
      resolvePromise: undefined,
      filename: "",
      fileicon: "",
      createOrRename: "",
    };
  },
  methods: {
    show(mimetype, type, createOrRename, filename) {
      this.createOrRename = createOrRename;
      if (type === "directory") this.fileicon = iconFromMime("folder");
      else this.fileicon = iconFromMime(mimetype);
      this.filename = filename;

      this.highlightFilename();

      // show popup
      this.$refs.popup.open();

      // return promise
      return new Promise((resolve) => {
        this.resolvePromise = resolve;
      });
    },
    highlightFilename() {
      // timeout to let html load
      setTimeout(() => {
        this.$refs.fileInput.focus();
        this.$refs.fileInput.setSelectionRange(
          0,
          this.filename.lastIndexOf(".")
        );
      });
    },
    rename() {
      this.$refs.popup.close();
      this.resolvePromise(this.filename);
    },
    cancel() {
      this.$refs.popup.close();
      this.resolvePromise(false);
    },
  },
};
</script>

<style lang="scss" scoped>
#dialog {
  width: 350px;
  height: 120px;
  background-color: $color-popup;
  border-radius: 2px;
}
#container {
  padding: 10px;
}
#body {
  float: right;
  margin-top: 4px;
}
#text {
  margin-bottom: 6px;
}
input {
  width: 220px;
  padding: 4px 10px;
}
#buttons {
  position: absolute;
  bottom: 0;
  right: 0;
}
button {
  padding: 4px;
  margin: 4px;
  margin-left: 0;
  width: 90px;
  border-radius: 4px;
}

#mime {
  float: left;
  img {
    margin: 10px;
  }
}
</style>
