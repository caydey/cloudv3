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

import arangeFiles from '@/helpers/arangeFiles.js'

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
        contextMenuActions = ['NEW_FOLDER', 'UPLOAD', 'PASTE', 'ARANGEMENT', 'ZOOM_IN', 'ZOOM_OUT', 'ZOOM_ORIGINAL', 'PROPERTIES']
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
            return this.openAction(focusedItem)
          case 'COPY':
            return this.copyAction(focusedItem)
          case 'CUT':
            return this.cutAction(focusedItem)
          case 'PASTE':
            return this.pasteAction(focusedItem)
          case 'RENAME':
            return this.renameAction(focusedItem)
          case 'DELETE':
            return this.deleteAction(focusedItem)
          case 'DOWNLOAD':
            return this.downloadAction(focusedItem)
          case 'PROPERTIES':
            return this.propertiesAction(focusedItem)
          case 'NEW_FOLDER':
            return this.newFolderAction(focusedItem)
          case 'UPLOAD':
            return this.uploadAction(focusedItem)
          case 'OPEN_IN_BROWSER':
            return this.openInBrowserAction(focusedItem)
          case 'ZOOM_IN':
            return this.zoomIncrement(1)
          case 'ZOOM_OUT':
            return this.zoomIncrement(-1)
          case 'ZOOM_ORIGINAL':
            return this.zoomOriginal()
        }
      })
    },
    zoomIncrement(zoomIncrement) {
      this.$store.commit('settings/incrementZoom', zoomIncrement)
    },
    zoomOriginal() {
      this.$store.commit('settings/resetZoom')
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
      sortField: 'settings/sortField',
      sortAscending: 'settings/sortAscending',
      sortFoldersFirst: 'settings/sortFoldersFirst'
    }),
    children() {
      const children = arangeFiles(this.exploredData.children, {
        field: this.sortField,
        foldersFirst: this.sortFoldersFirst,
        ascending: this.sortAscending
      })
      return children
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
