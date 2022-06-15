<template>
  <div id="filepanel" @contextmenu.stop.prevent="showContextMenu($event, null)">
    <div id="files">
      <div v-for="item in children" :key="item">
        <PanelItem
          draggable="true"
          @dragstart="onItemDrag($event, item)"
          @dragover.prevent
          @drop="onItemDrop($event, item)"
          :focused="contextMenuFocus && item.name === contextMenuFocus.name"
          :item="item"
          :zoomLevel="zoomLevel"
          @contextmenu.stop.prevent="showContextMenu($event, item)"
        />
      </div>
    </div>

    <ContextMenu ref="contextMenu" />
    <DragMenu ref="dragMenu" />

    <DeleteDialog ref="deleteDialog" />
    <RenameDialog ref="renameDialog" />
    <ErrorDialog ref="errorDialog" />
    <PropertiesDialog ref="propertiesDialog" />
    <UploadDialog ref="uploadDialog" />
  </div>
</template>

<script>
import PanelItem from './PanelItem'

import ContextMenu from '@/components/menus/ContextMenu'
import DragMenu from '@/components/menus/DragMenu'

import DeleteDialog from '@/components/dialogs/DeleteDialog'
import RenameDialog from '@/components/dialogs/RenameDialog'
import ErrorDialog from '@/components/dialogs/ErrorDialog'
import PropertiesDialog from '@/components/dialogs/PropertiesDialog'
import UploadDialog from '@/components/dialogs/upload-dialog/UploadDialog'

import childSorter from '@/helpers/childSorter.js'

import { mapGetters } from 'vuex'


import cloudApi from '@/api/cloud'

export default {
  name: 'FilePanel',
  components: {
    PanelItem,
    ContextMenu,
    DeleteDialog,
    RenameDialog,
    ErrorDialog,
    PropertiesDialog,
    UploadDialog,
    DragMenu
  },
  data() {
    return {
      contextMenuFocus: null,
      zoomLevel: 0,
    }
  },
  mounted() {
    // reload zoom level from localstorage
    let savedZoomLevel = Number(localStorage.getItem('ZOOM_LEVEL')) || 0
    this.zoomLevel = savedZoomLevel
  },
  methods: {
    onItemDrag(event, item) {
      event.dataTransfer.setData('path', item.path)
    },
    onItemDrop(event, item) { // item is the item the dragged item was dropped onto
      if (item.type !== 'directory')
        return

      let sourcePath = event.dataTransfer.getData('path')
      let destPath = item.path

      if (sourcePath === destPath) // drag onto self
        return

      this.$refs.dragMenu.show({
        cursorPos: {
          x: event.clientX,
          y: event.clientY
        }
      }).then((action) => {
        let apiFunction
        if (action === 'COPY')
          apiFunction = cloudApi.copy
        else if (action === 'MOVE')
          apiFunction = cloudApi.move
        else // canceled
          return

        apiFunction(sourcePath, destPath, (err) => {
          let copyMove = (action === 'COPY') ? 'copy' : 'move'
          if (err) // show error dialog
            this.$refs.errorDialog.show({
              title: `Failed to ${copyMove}`,
              message: err
            })
        })
      })
    },
    showContextMenu(event, item) {
      let contextMenuActions
      if (item) { // selected file
        if (item.type === 'file')
          contextMenuActions = ['OPEN', 'OPEN_IN_BROWSER', 'COPY', 'CUT', 'RENAME', 'DELETE', 'DOWNLOAD', 'PROPERTIES']
        else // folder
          contextMenuActions = ['OPEN', 'COPY', 'CUT', 'PASTE_INTO', 'RENAME', 'DELETE', 'PROPERTIES']
        this.contextMenuFocus = item
      } else { // panel
        this.contextMenuFocus = this.exploredData
        contextMenuActions = ['NEW_FOLDER', 'UPLOAD', 'PASTE', 'ZOOM_IN', 'ZOOM_OUT', 'ZOOM_ORIGINAL', 'PROPERTIES']
      }

      let contextMenuPos = {
        x: event.clientX,
        y: event.clientY
      }

      this.$refs.contextMenu.show({
        cursorPos: contextMenuPos,
        menuActions: contextMenuActions
      }).then((action) => {
        const focusedItem = this.contextMenuFocus
        this.contextMenuFocus = null
        switch (action) {
          case 'OPEN':
            this.openAction(focusedItem)
            break
          case 'COPY':
            this.copyAction(focusedItem)
            break
          case 'CUT':
            this.cutAction(focusedItem)
            break
          case 'PASTE':
            this.pasteAction(focusedItem)
            break
          case 'RENAME':
            this.renameAction(focusedItem)
            break
          case 'DELETE':
            this.deleteAction(focusedItem)
            break
          case 'DOWNLOAD':
            this.downloadAction(focusedItem)
            break
          case 'PROPERTIES':
            this.propertiesAction(focusedItem)
            break
          case 'NEW_FOLDER':
            this.newFolderAction(focusedItem)
            break
          case 'UPLOAD':
            this.uploadAction(focusedItem)
            break
          case 'OPEN_IN_BROWSER':
            this.openInBrowserAction(focusedItem)
            break
          case 'ZOOM_IN':
            this.zoomAction(1)
            break
          case 'ZOOM_OUT':
            this.zoomAction(-1)
            break
          case 'ZOOM_ORIGINAL':
            this.zoomAction(0)
            break
        }
      })
    },
    zoomAction(zoomIncrement) {
      let newZoom = this.zoomLevel + zoomIncrement

      // reset zoom
      if (zoomIncrement === 0)
        newZoom = 0

      // zoom out of bounds
      if (newZoom < -2 || newZoom > 2)
        return

      // apply zoom level and save to local storage
      this.zoomLevel = newZoom
      localStorage.setItem('ZOOM_LEVEL', this.zoomLevel)
    },
    openInBrowserAction(focusedItem) {
      window.open(focusedItem.location, '_blank');
    },
    downloadAction(focusedItem) {
      window.location.assign(focusedItem.location)
    },
    openAction(focusedItem) {
      this.$store.commit('explorer/setPath', focusedItem.path)
    },
    copyAction(focusedItem) {
      this.$store.commit('clipboard/setContents', [focusedItem.path])
      this.$store.commit('clipboard/setAction', 'COPY')
    },
    cutAction(focusedItem) {
      this.$store.commit('clipboard/setContents', [focusedItem.path])
      this.$store.commit('clipboard/setAction', 'CUT')
    },
    propertiesAction(focusedItem) {
      this.$refs.propertiesDialog.show(focusedItem)
    },
    uploadAction(focusedItem) {
      this.$refs.uploadDialog.show({
        'path': focusedItem.path,
        'uploadFunction': cloudApi.upload
      })
    },
    deleteAction(focusedItem) {
      // add dialog
      const filename = focusedItem.name
      this.$refs.deleteDialog.show(filename).then((confirmed) => {
        if (confirmed) {
          const target = focusedItem.path
          cloudApi.delete(target, (err) => {
            if (err) // show error dialog
              this.$refs.errorDialog.show({
                title: `Failed to delete file`,
                message: err
              })
          })
        }
      })
    },
    pasteAction(focusedItem) {
      // get clipboard data
      const contents = this.$store.getters['clipboard/contents']
      const target = focusedItem.path
      const clipboardAction = this.$store.getters['clipboard/action']
      // clear clipboard
      this.$store.commit('clipboard/clear')

      // copy or move
      let apiFunction
      if (clipboardAction === 'CUT')
        apiFunction = cloudApi.move
      else if (clipboardAction === 'COPY')
        apiFunction = cloudApi.copy

      // api call
      apiFunction(contents[0], target, (err) => {
        if (err)
          this.$refs.errorDialog.show({
            title: `Failed to paste.`,
            message: err
          })
      })
    },
    renameAction(focusedItem) {
      const mimetype = focusedItem.mime
      const type = focusedItem.type
      const filename = focusedItem.name
      this.$refs.renameDialog.show(mimetype, type, filename).then((newName) => {
        if (newName) {
          // no name change
          if (newName === filename) return

          const oldPath = focusedItem.path
          const newPath = this.exploredData.path + '/' + newName
          cloudApi.move(oldPath, newPath, (err) => { // api call
            if (err) // show error dialog if errer
              this.$refs.errorDialog.show({
                title: `Failed to Rename file/folder`,
                message: err
              })
          })
        }
      })
    },
    newFolderAction(focusedItem) {
      const mimetype = 'folder'
      const filename = 'New Folder'
      const type = 'directory'
      this.$refs.renameDialog.show(mimetype, type, filename).then((folderName) => {
        if (folderName) {
          const path = focusedItem.path + '/' + folderName
          cloudApi.mkdir(path, (err) => { // api call
            if (err) // show error dialog if errer
              this.$refs.errorDialog.show({
                title: `Failed to Create folder "${folderName}"`,
                message: err
              })
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      exploredData: 'explorer/data',
    }),
    children() {
      return childSorter(this.$store.state.explorer.data.children)
    }
  }
}
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
</style>
