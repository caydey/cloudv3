<template>
  <div>
    <PopupModal ref="popup">
      <input
        type="file"
        style="display: none"
        ref="fileInput"
        @change="onFilePicked"
        multiple
      />
      <div id="dialog" class="shadow">
        <div id="title">
          <p class="overflowEllipsis">Upload to "{{ folder }}"</p>
        </div>
        <div
          @drop.prevent="onFileDrop"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          id="fileContainer"
        >
          <!-- on drag overlay -->
          <template v-if="fileDraggedOver">
            <div id="dragOverlay" class="absoluteCenter">
              <p>[drop to start upload]</p>
            </div>
          </template>

          <!-- uploaded file row -->
          <div
            v-for="uploadingFile in uploadingFiles"
            :key="uploadingFile.file"
            class="row"
          >
            <!-- filename with loading bar -->
            <div class="filename">
              <div
                class="loadingBar"
                :style="{ width: uploadingFile.progress + '%' }"
              />
              <p class="overflowEllipsis verticallyCenter">
                {{ uploadingFile.file.name }}
              </p>
            </div>

            <!-- buttons / state -->
            <template v-if="uploadingFile.completed">
              <div class="rightBtn uploadedText">
                <p class="verticallyCenter textCenter">Uploaded</p>
              </div>
            </template>
            <template v-else-if="uploadingFile.canceled">
              <div class="rightBtn canceledText">
                <p class="verticallyCenter textCenter">Canceled</p>
              </div>
            </template>
            <template v-else>
              <button
                class="rightBtn cancelBtn"
                @click="cancelUpload(uploadingFile)"
              >
                Cancel
              </button>
            </template>
          </div>
          <button class="row addBtn" @click="addFile">+</button>
        </div>
        <button class="actionButton" id="closeBtn" @click="close">Close</button>
      </div>
      <UploadExitDialog ref="exitDialog" />
    </PopupModal>
  </div>
</template>

<script>
import PopupModal from '../PopupModal'
import UploadExitDialog from './UploadExitDialog'


export default {
  name: "UploadDialog",
  components: {
    PopupModal,
    UploadExitDialog
  },
  data() {
    return {
      path: '',
      folder: '',
      uploadFunction: undefined,
      uploadingFiles: [],
      fileDraggedOver: false
    }
  },
  methods: {
    show(opts) {
      this.path = opts.path
      const split = opts.path.split('/')
      this.folder = split[split.length - 1] || '/'

      this.uploadFunction = opts.uploadFunction

      // reset uploading files
      this.uploadingFiles = []

      // show popup
      this.$refs.popup.open()

      // prompt user before exiting
      this.$refs.popup.overrideCloseAction(this.close)
    },
    close() {
      // dont prompt user if there is no active uploads
      let activeUploads = false
      for (let i = 0; i < this.uploadingFiles.length; i++)
        if (!this.uploadingFiles[i].completed || this.uploadingFiles[i].canceled)
          activeUploads = true
      if (!activeUploads) {
        this.haltUploadsAndClose()
        return
      }

      // ask user if they wish to halt uploads
      this.$refs.exitDialog.show().then((allowClose) => {
        if (allowClose) {
          this.haltUploadsAndClose()
        }
      })
    },
    haltUploadsAndClose() {
      // halt uploads
      this.uploadingFiles.forEach((uploadingFile) => {
        if (!uploadingFile.completed && !uploadingFile.canceled) {
          this.cancelUpload(uploadingFile)
        }
      })
      // dont interupt close
      this.$refs.popup.overrideCloseAction(null)
      // close popup
      this.$refs.popup.close()
    },
    onFilePicked(event) {
      for (let i = 0; i < event.target.files.length; i++) {
        this.handleFileSelected(event.target.files[i])
      }
    },
    handleFileSelected(file) {
      let uploadingFile = {
        file: file,
        progress: 0,
        completed: false,
        canceled: false,
        controller: null
      }
      const index = this.uploadingFiles.push(uploadingFile) - 1
      // we use index as refrence instead of pointer as that wont update vuejs tags
      this.startFileUpload(index)
    },
    startFileUpload(index) {
      let controller = this.uploadFunction(
        this.path,
        this.uploadingFiles[index].file,
        (progressPercent) => {
          this.uploadingFiles[index].progress = progressPercent
        },
        (err) => {
          if (err) {
            if (err === 'canceled') {
              return
            }
            return
          } else {
            this.uploadingFiles[index].progress = 100
            this.uploadingFiles[index].completed = true
          }
        }
      )
      this.uploadingFiles[index].controller = controller
    },
    cancelUpload(uploadingFile) {
      uploadingFile.canceled = true
      if (uploadingFile.controller)
        uploadingFile.controller.abort()
    },
    addFile() {
      this.$refs.fileInput.click()
    },
    onFileDrop(event) {
      this.onDragLeave() // hide drag overlay
      const droppedFiles = event.dataTransfer.files
      // no files dragged
      if (!droppedFiles)
        return

      for (let i = 0; i < droppedFiles.length; i++) {
        const droppedFile = droppedFiles[i]
        if (droppedFile.type && droppedFile.size > 0) { // not folder
          this.handleFileSelected(droppedFiles[i])
        }
      }
    },
    onDragOver() {
      this.fileDraggedOver = true
    },
    onDragLeave() {
      this.fileDraggedOver = false
    }
  }
}
</script>

<style lang="scss" scoped>
#dialog {
  width: 400px;
  background-color: $color-popup;
  border-radius: 2px;
}
#title {
  padding: 8px;
  p {
    font-size: 24px;
  }
}
#fileContainer {
  height: 260px;
  margin: 2px;
  // padding-right: 10px;
  overflow: auto;
}

#dragOverlay {
  z-index: 20;
  p {
    background-color: $color-popup;
    border-radius: 10px;
    padding: 2px;
    font-family: monospace;
    font-size: 20px;
    width: 300px;
    text-align: center;
  }
}

.row {
  width: 100%;
  height: 30px;
}
.filename,
.rightBtn {
  height: 100%;
  display: inline-block;
}

.rightBtn {
  color: black;
}
.cancelBtn {
  background-color: $color-warning;
  &:active {
    background-color: $color-warning-active;
  }
}

.filename {
  width: calc(100% - 100px);
  position: relative;
  p {
    // position: relative;
    padding: 2px;
    padding-left: 10px;
  }
}

.rightBtn {
  float: right;
  width: 100px;
  height: 30px;
}

.uploadedText,
.canceledText {
  p {
    color: black;
  }
}
.uploadedText {
  background-color: $color-progress-completed;
}
.canceledText {
  background-color: $color-danger;
}

.addBtn {
  width: 100%;
  background-color: $color-go;
  color: black;
  height: 30px;
  &:active {
    background-color: $color-go-active;
  }
}

.loadingBar {
  background-color: $color-progress;
  position: absolute;
  height: 30px;
}

#closeBtn {
  bottom: 0;
  width: 100%;
  height: 40px;
}
</style>