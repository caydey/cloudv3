<template>
  <div
    id="filepanel"
    ref="filepanel"
    :tabindex="0"
    @keydown="keydownEvent"
    @contextmenu.stop.prevent="showContextMenu($event, null)"
    @mousedown="beginSelection"
    @mouseup="endSelection"
    @mousemove="expandSelection"
  >
    <div id="files">
      <PanelItem
        ref="items"
        v-for="item in children"
        :key="item"
        class="panelItem"
        draggable="true"
        @mousedown.stop
        @dragover.prevent
        @dragstart="onItemDrag($event, item)"
        @drop="onItemDrop($event, item)"
        :item="item"
        @contextmenu.stop.prevent="showContextMenu($event, item)"
      />
    </div>

    <div v-show="selectionBox.active" id="selection" ref="selectionBox" />

    <SearchBar ref="searchBar" />

    <ContextMenu ref="contextMenu" />
    <DragMenu ref="dragMenu" />

    <DeleteDialog ref="deleteDialog" />
    <RenameDialog ref="renameDialog" />
    <ErrorDialog ref="errorDialog" />
    <PropertiesDialog ref="propertiesDialog" />
    <UploadDialog ref="uploadDialog" />
    <SettingsDialog ref="settingsDialog" />
  </div>
</template>

<script>
import PanelItem from "./PanelItem";
import SearchBar from "./SearchBar.vue";

import ContextMenu from "@/components/menus/ContextMenu";
import DragMenu from "@/components/menus/DragMenu";

import DeleteDialog from "@/components/dialogs/DeleteDialog";
import RenameDialog from "@/components/dialogs/RenameDialog";
import ErrorDialog from "@/components/dialogs/ErrorDialog";
import PropertiesDialog from "@/components/dialogs/PropertiesDialog";
import UploadDialog from "@/components/dialogs/upload-dialog/UploadDialog";
import SettingsDialog from "@/components/dialogs/SettingsDialog";

import arangeFiles from "@/helpers/arangeFiles.js";
import createPathUrl from "@/helpers/createPathUrl.js";
import searchFiles from "@/helpers/searchFiles.js";

import { mapGetters } from "vuex";

import cloudApi from "@/api/cloud";

let selectionUpdateCounter = 0;
const SELECTION_UPDATE_TIMEOUT = 4;
export default {
  name: "FilePanel",
  components: {
    PanelItem,
    ContextMenu,
    DragMenu,
    DeleteDialog,
    RenameDialog,
    ErrorDialog,
    PropertiesDialog,
    UploadDialog,
    SettingsDialog,
    SearchBar,
  },
  data() {
    return {
      // contextMenuFocus: null,
      selectionBox: { active: false, left: 0, top: 0, right: 0, bottom: 0 },
      selectionBoxPos: { left: 0, top: 0, right: 0, bottom: 0 },
      keydownListener: true,
    };
  },
  methods: {
    keydownEvent(evt) {
      if (!this.keydownListener) return;
      if (evt.key.length !== 1) {
        return;
      }
      this.keydownListener = false;
      this.$refs.searchBar.begin(evt.key, ({ action, search }) => {
        if (action === "SEARCH") {
          const matches = searchFiles(this.children, search);
          this.$store.commit("clipboard/setSelection", matches);
        } else if (action === "EXIT" || action === "ENTER") {
          const matches = this.$store.getters["clipboard/selection"];
          this.$store.commit("clipboard/clearSelection");
          if (action === "ENTER") {
            // check if 1 file highlighted, then open
            if (matches.length === 1) {
              this.$store.commit("explorer/setPath", matches[0].path);
            }
          }
          this.keydownListener = true;
          this.$refs.filepanel.focus();
        }
        this.updateFileHighlights();
        this.updateFileHighlights({ scrollToSelection: true });
      });
    },
    findSelectionIntersections() {
      const fileElements = document.getElementById("files").children;
      let selection = [];
      // this.clearFileHighlights()
      for (let i = 0; i < fileElements.length; i++) {
        const bounds = fileElements[i].getBoundingClientRect();
        const fileElemPos1 = this.getRelativePos(bounds.left, bounds.top);
        const fileElemPos2 = this.getRelativePos(bounds.right, bounds.bottom);

        const overlap = !(
          this.selectionBoxPos.right < fileElemPos1.x ||
          this.selectionBoxPos.left > fileElemPos2.x ||
          this.selectionBoxPos.bottom < fileElemPos1.y ||
          this.selectionBoxPos.top > fileElemPos2.y
        );

        if (overlap) {
          selection.push(this.children[i]);
        }
      }
      this.$store.commit("clipboard/setSelection", selection);
      this.updateFileHighlights();
    },
    updateFileHighlights({ scrollToSelection } = {}) {
      if (this.$refs.items) {
        let firstMatch = false;
        this.$refs.items.forEach((item) => {
          // reset highlights
          item.$el.style.backgroundColor = "";
          item.$el.style.opacity = 1;
          if (
            this.$store.getters["clipboard/selectionIncludes"](item.item.path)
          ) {
            item.$el.style.backgroundColor = "#3596D6"; // highlight selected items
            if (!firstMatch && scrollToSelection) {
              firstMatch = true;
              item.$el.scrollIntoView();
            }
          } else if (this.clipboardAction === "CUT") {
            if (
              this.$store.getters["clipboard/contentsIncludes"](item.item.path)
            ) {
              item.$el.style.opacity = 0.6; // dull cut items
            }
          }
        });
      }
    },
    positionSelectionBox() {
      this.selectionBoxPos.left = this.selectionBox.left;
      if (this.selectionBox.left > this.selectionBox.right) {
        this.selectionBoxPos.left = this.selectionBox.right;
      }
      const width = Math.abs(this.selectionBox.right - this.selectionBox.left);
      this.selectionBoxPos.right = this.selectionBoxPos.left + width;

      this.selectionBoxPos.top = this.selectionBox.top;
      if (this.selectionBox.top > this.selectionBox.bottom) {
        this.selectionBoxPos.top = this.selectionBox.bottom;
      }
      const height = Math.abs(this.selectionBox.bottom - this.selectionBox.top);
      this.selectionBoxPos.bottom = this.selectionBoxPos.top + height;

      this.$refs.selectionBox.style.left = this.selectionBoxPos.left + "px";
      this.$refs.selectionBox.style.top = this.selectionBoxPos.top + "px";
      this.$refs.selectionBox.style.width = width + "px";
      this.$refs.selectionBox.style.height = height + "px";
    },
    getRelativePos(posX, posY) {
      const filepanelElem = document.getElementById("filepanel");
      const bounds = filepanelElem.getBoundingClientRect();

      const scrollOffset = filepanelElem.scrollTop;
      // position of cursor at point not center
      const cursorOffsetY = -12;
      const cursorOffsetX = -2;

      const relativePosX = posX - bounds.left + cursorOffsetX;
      const relativePosY = posY - bounds.top + scrollOffset + cursorOffsetY;

      return { x: relativePosX, y: relativePosY };
    },
    beginSelection(event) {
      // clear previously selected items
      this.$store.commit("clipboard/clearSelection");
      this.updateFileHighlights();

      const pos = this.getRelativePos(event.clientX, event.clientY);
      this.selectionBox.left = pos.x;
      this.selectionBox.top = pos.y;

      this.selectionBox.right = pos.x;
      this.selectionBox.bottom = pos.y;
      this.selectionBox.active = true;
      this.positionSelectionBox();
    },
    endSelection(event) {
      const pos = this.getRelativePos(event.clientX, event.clientY);
      this.selectionBox.right = pos.x;
      this.selectionBox.bottom = pos.y;
      this.selectionBox.active = false;
    },
    expandSelection(event) {
      // if selectionbox is shown
      if (!this.selectionBox.active) return;

      // only trigger mousemove event 1 out of 4 times
      selectionUpdateCounter++;
      if (selectionUpdateCounter < SELECTION_UPDATE_TIMEOUT) return;
      selectionUpdateCounter = 0;

      const pos = this.getRelativePos(event.clientX, event.clientY);
      this.selectionBox.right = pos.x;
      this.selectionBox.bottom = pos.y;
      this.positionSelectionBox();
      this.findSelectionIntersections();
    },
    onItemDrag(event, item) {
      event.dataTransfer.setData("path", item.path);
    },
    onItemDrop(event, item) {
      // item is the item the dragged item was dropped onto
      if (item.type !== "directory") return;

      let sourcePath = event.dataTransfer.getData("path");
      let destPath = item.path;

      if (sourcePath === destPath)
        // drag onto self
        return;

      this.$refs.dragMenu
        .show({
          cursorPos: {
            x: event.clientX,
            y: event.clientY,
          },
        })
        .then((action) => {
          let apiFunction;
          if (action === "COPY") apiFunction = cloudApi.copy;
          else if (action === "MOVE") apiFunction = cloudApi.move;
          // canceled
          else return;

          apiFunction([sourcePath], destPath, (err) => {
            let copyMove = action === "COPY" ? "copy" : "move";
            if (err)
              // show error dialog
              this.$refs.errorDialog.show({
                title: `Failed to ${copyMove}`,
                message: err,
              });
          });
        });
    },
    showContextMenu(event, item) {
      let contextMenuActions;
      if (item) {
        // selected file
        // multi file selection
        if (this.$store.getters["clipboard/selectionIncludes"](item.path)) {
          contextMenuActions = ["OPEN", "COPY", "CUT", "DELETE"];
          // add 'Download' action if only file selection
          if (this.$store.getters["clipboard/selectionOnlyFiles"]) {
            contextMenuActions.push("DOWNLOAD");
          }
          // dont need to $store.commit as the selected items are already in the store
        } else {
          // clicked on file outwith selected files or no files where already selected
          if (item.type === "file") {
            contextMenuActions = [
              "OPEN",
              "OPEN_IN_BROWSER",
              "COPY",
              "CUT",
              "RENAME",
              "DELETE",
              "DOWNLOAD",
              "PROPERTIES",
            ];
          } else {
            // folder
            contextMenuActions = [
              "OPEN",
              "COPY",
              "CUT",
              "PASTE_INTO",
              "RENAME",
              "DELETE",
              "PROPERTIES",
            ];
          }
          this.$store.commit("clipboard/setSelection", [item]);
        }
      } else {
        // panel
        contextMenuActions = [
          "NEW_FOLDER",
          "UPLOAD",
          "PASTE",
          "ARANGEMENT",
          "ZOOM_IN",
          "ZOOM_OUT",
          "ZOOM_ORIGINAL",
          "PROPERTIES",
          "SETTINGS",
        ];
        this.$store.commit("clipboard/setSelection", [this.exploredData]);
      }
      // update highlights since 'clipboard/selection' will be modified
      this.updateFileHighlights();

      let contextMenuPos = {
        x: event.clientX,
        y: event.clientY,
      };

      this.$refs.contextMenu
        .show({
          cursorPos: contextMenuPos,
          menuActions: contextMenuActions,
        })
        .then((action) => {
          const selection = this.clipboardSelection;
          if (action === "OPEN") {
            // OPEN
            this.openAction(selection); // multiselect support
          } else if (action === "PASTE") {
            // PASTE
            this.pasteAction(selection); // multiselect support
          } else if (action === "RENAME") {
            // RENAME
            this.renameAction(selection[0]);
          } else if (action === "DELETE") {
            // DELETE
            this.deleteAction(selection); // multiselect support
          } else if (action === "DOWNLOAD") {
            // DOWNLOAD
            this.downloadAction(selection); // multiselect support
          } else if (action === "PROPERTIES") {
            // PROPERTIES
            this.$refs.propertiesDialog.show(selection[0]);
          } else if (action === "NEW_FOLDER") {
            // NEW_FOLDER
            this.newFolderAction(selection[0]);
          } else if (action === "UPLOAD") {
            // UPLOAD
            this.uploadAction(selection[0]);
          } else if (action === "OPEN_IN_BROWSER") {
            // OPEN_IN_BROWSER
            this.openBrowserAction(selection); // multiselect support
          } else if (action === "COPY" || action === "CUT") {
            // COPY/CUT
            this.$store.commit("clipboard/setAction", action);
          } else if (action === "ZOOM_IN") {
            // ZOOM_IN
            this.$store.commit("settings/incrementZoom", 1);
          } else if (action === "ZOOM_OUT") {
            // ZOOM_OUT
            this.$store.commit("settings/incrementZoom", -1);
          } else if (action === "ZOOM_ORIGINAL") {
            // ZOOM_ORIGINAL
            this.$store.commit("settings/resetZoom");
          } else if (action === "ARANGE_BY_NAME") {
            // ARANGE_BY_NAME
            this.$store.commit("settings/setSortField", "name");
          } else if (action === "ARANGE_BY_SIZE") {
            // ARANGE_BY_SIZE
            this.$store.commit("settings/setSortField", "size");
          } else if (action === "ARANGE_BY_DATE") {
            // ARANGE_BY_DATE
            this.$store.commit("settings/setSortField", "modified");
          } else if (action === "ARANGE_ASCENDING") {
            // ARANGE_ASCENDING
            this.$store.commit("settings/setSortAscending", true);
          } else if (action === "ARANGE_DESCENDING") {
            // ARANGE_DESCENDING
            this.$store.commit("settings/setSortAscending", false);
          } else if (action === "ARANGE_FOLDERS_FIRST") {
            // ARANGE_FOLDERS_FIRST
            this.$store.commit("settings/toggleSortFoldersFirst");
          } else if (action === "SETTINGS") {
            // SETTINGS
            this.$refs.settingsDialog.show();
          }

          // after contextmenu is closed clear selection
          this.$store.commit("clipboard/clearSelection");
          this.updateFileHighlights();
        });
    },
    openBrowserAction(selection) {
      selection.forEach((item) => {
        window.open(item.location, "_blank");
      });
    },
    openAction(selection) {
      this.$store.commit("explorer/setPath", selection[0].path);
      // if selected multiple files and clicked 'open' open the extra selected
      // files in new tabs
      for (let i = 1; i < selection.length; i++) {
        const pageUrl = createPathUrl(selection[i].path);
        window.open(pageUrl, "_blank");
      }
    },
    downloadAction(selection) {
      selection.forEach((item) => {
        // const link
        // link = document.createElement('a')
        // link.href = item.location // location
        // link.download = item.name // filename
        // link.click()
        // BROWSER BLOCKS DOWNLOADING MULTIPLE FILES, NEED TO FIND WORKAROUND!
        window.location.assign(item.location);
      });
    },
    uploadAction(selection) {
      this.$refs.uploadDialog.show({
        path: selection.path,
        uploadFunction: cloudApi.upload,
      });
    },
    deleteAction(selection) {
      // show confirmation dialog
      this.$refs.deleteDialog.show(selection).then((confirmed) => {
        if (confirmed) {
          const paths = selection.map((item) => item.path); // paths of selection
          cloudApi.delete(paths, (err) => {
            if (err) {
              this.$refs.errorDialog.show({
                title: `Failed to delete file`,
                message: err,
              });
            }
          });
        }
      });
    },
    pasteAction(selection) {
      // get clipboard action
      const clipboardAction = this.$store.getters["clipboard/action"];

      // copy or move
      let copyOrMoveFunc;
      if (clipboardAction === "CUT") {
        copyOrMoveFunc = cloudApi.move;
      } else if (clipboardAction === "COPY") {
        copyOrMoveFunc = cloudApi.copy;
      }

      // paste contents (array of clipboard paths)
      const contents = this.$store.getters["clipboard/contents"];
      const paths = contents.map((item) => item.path);
      // paste target
      const target = selection[0].path;
      // api call
      copyOrMoveFunc(paths, target, (err) => {
        if (err)
          this.$refs.errorDialog.show({
            title: `Failed to paste.`,
            message: err,
          });
      });

      // clear clipboard
      this.$store.commit("clipboard/clear");
    },
    renameAction(selection) {
      const mimetype = selection.mime;
      const type = selection.type;
      const filename = selection.name;
      this.$refs.renameDialog
        .show(mimetype, type, "RENAME", filename)
        .then((newName) => {
          if (newName) {
            // no name change
            if (newName === filename) return;

            const oldPath = selection.path;
            const newPath = this.exploredData.path + "/" + newName;
            cloudApi.move([oldPath], newPath, (err) => {
              // api call
              if (err)
                // show error dialog if errer
                this.$refs.errorDialog.show({
                  title: `Failed to Rename file/folder`,
                  message: err,
                });
            });
          }
        });
    },
    newFolderAction(selection) {
      const mimetype = "folder";
      const filename = "New Folder";
      const type = "directory";
      this.$refs.renameDialog
        .show(mimetype, type, "CREATE", filename)
        .then((folderName) => {
          if (folderName) {
            const path = selection.path + "/" + folderName;
            cloudApi.mkdir(path, (err) => {
              // api call
              if (err)
                // show error dialog if errer
                this.$refs.errorDialog.show({
                  title: `Failed to Create folder "${folderName}"`,
                  message: err,
                });
            });
          }
        });
    },
  },
  computed: {
    ...mapGetters({
      exploredData: "explorer/data",
      sortField: "settings/sortField",
      sortFoldersFirst: "settings/sortFoldersFirst",
      sortAscending: "settings/sortAscending",
      zoomLevel: "settings/zoomLevel",
      clipboardSelection: "clipboard/selection",
      clipboardContents: "clipboard/contents",
      clipboardAction: "clipboard/action",
    }),
    children() {
      const children = arangeFiles(this.exploredData.children, {
        field: this.sortField,
        foldersFirst: this.sortFoldersFirst,
        ascending: this.sortAscending,
      });
      return children;
    },
  },
  watch: {
    exploredData() {
      // refresh selected files on data change
      // need timeout or it wont work
      setTimeout(this.updateFileHighlights);
    },
  },
};
</script>

<style lang="scss" scoped>
#filepanel {
  // scroll div
  height: 100%;
  overflow: auto;
}

#files {
  margin: 10px;
}

#selection {
  z-index: 20;
  background-color: rgba($color-active, 0.4);
  border: 1px solid $color-active;
  border-radius: 3px;
  position: relative;
}
</style>
