<template>
  <div>
    <MenuModal ref="menu">
      <!-- NEW_FOLDER -->
      <template v-if="menuActions.includes('NEW_FOLDER')">
        <div class="row" @click="menuAction('NEW_FOLDER')">
          <ActionIcon class="icon" icon="folder-new" />
          <span>Create Folder...</span>
        </div>
      </template>

      <!-- UPLOAD -->
      <template v-if="menuActions.includes('UPLOAD')">
        <div class="row" @click="menuAction('UPLOAD')">
          <ActionIcon class="icon" icon="upload" />
          <span>Upload Files...</span>
        </div>
        <!-- ROW_BREAK -->
        <div class="rowBreak"></div>
      </template>

      <!-- OPEN -->
      <template v-if="menuActions.includes('OPEN')">
        <div class="row" @click="menuAction('OPEN')">
          <ActionIcon class="icon" icon="open" />
          <span>Open</span>
        </div>
        <!-- OPEN_IN_BROWSER -->
        <template v-if="menuActions.includes('OPEN_IN_BROWSER')">
          <div class="row" @click="menuAction('OPEN_IN_BROWSER')">
            <ActionIcon class="icon" icon="browser" />
            <span>Open in Browser</span>
          </div>
        </template>
        <!-- ROW_BREAK -->
        <div class="rowBreak" />
      </template>

      <!-- COPY -->
      <template v-if="menuActions.includes('COPY')">
        <div class="row" @click="menuAction('COPY')">
          <ActionIcon class="icon" icon="copy" />
          <span>Copy</span>
        </div>
      </template>

      <!-- CUT -->
      <template v-if="menuActions.includes('CUT')">
        <div class="row" @click="menuAction('CUT')">
          <ActionIcon class="icon" icon="cut" />
          <span>Cut</span>
        </div>
      </template>

      <!-- PASTE -->
      <template v-if="menuActions.includes('PASTE')">
        <div
          class="row"
          :class="{ rowDisabled: !canPaste }"
          @click="canPaste && menuAction('PASTE')"
        >
          <ActionIcon class="icon" icon="paste" />
          <!-- Paste *Into Folder* if folder -->
          <span>Paste</span>
        </div>
      </template>

      <!-- PASTE INTO FOLDER -->
      <template v-if="menuActions.includes('PASTE_INTO')">
        <div
          class="row"
          :class="{ rowDisabled: !canPaste }"
          @click="canPaste && menuAction('PASTE')"
        >
          <ActionIcon class="icon" icon="paste" />
          <!-- Paste *Into Folder* if folder -->
          <span>Paste Into Folder</span>
        </div>
      </template>

      <!-- RENAME -->
      <template v-if="menuActions.includes('RENAME')">
        <!-- ROW_BREAK -->
        <div class="rowBreak" />
        <div class="row" @click="menuAction('RENAME')">
          <ActionIcon class="icon" icon="edit" />
          <span>Rename</span>
        </div>
      </template>

      <!-- DELETE -->
      <template v-if="menuActions.includes('DELETE')">
        <div class="row" @click="menuAction('DELETE')">
          <ActionIcon class="icon" icon="delete" />
          <span>Delete</span>
        </div>
      </template>

      <!-- DOWNLOAD -->
      <template v-if="menuActions.includes('DOWNLOAD')">
        <div class="row" @click="menuAction('DOWNLOAD')">
          <ActionIcon class="icon" icon="download" />
          <span>Download</span>
        </div>
      </template>

      <!-- ARANGEMENT -->
      <template v-if="menuActions.includes('ARANGEMENT')">
        <!-- ROW_BREAK -->
        <div class="rowBreak" />
        <div class="row" @click="menuAction('ARANGEMENT')">
          <ActionIcon class="icon" icon="arangement" />
          <span>Arange Items...</span>
        </div>
      </template>

      <!-- ZOOM_IN -->
      <template v-if="menuActions.includes('ZOOM_IN')">
        <!-- ROW_BREAK -->
        <div class="rowBreak" />
        <div class="row" @click="menuAction('ZOOM_IN')">
          <ActionIcon class="icon" icon="zoom-in" />
          <span>Zoom In</span>
        </div>
      </template>

      <!-- ZOOM_OUT -->
      <template v-if="menuActions.includes('ZOOM_OUT')">
        <div class="row" @click="menuAction('ZOOM_OUT')">
          <ActionIcon class="icon" icon="zoom-out" />
          <span>Zoom Out</span>
        </div>
      </template>

      <!-- ZOOM_ORIGINAL -->
      <template v-if="menuActions.includes('ZOOM_ORIGINAL')">
        <div class="row" @click="menuAction('ZOOM_ORIGINAL')">
          <ActionIcon class="icon" icon="zoom-original" />
          <span>Normal Size</span>
        </div>
      </template>

      <!-- PROPERTIES -->
      <template v-if="menuActions.includes('PROPERTIES')">
        <!-- ROW_BREAK -->
        <div class="rowBreak" />
        <div class="row" @click="menuAction('PROPERTIES')">
          <ActionIcon class="icon" icon="properties" />
          <span>Properties...</span>
        </div>
      </template>

      <template v-if="menuActions.includes('SETTINGS')">
        <!-- ROW_BREAK -->
        <div class="rowBreak" />
        <div class="row" @click="menuAction('SETTINGS')">
          <ActionIcon class="icon" icon="settings" />
          <span>Settings...</span>
        </div>
      </template>
    </MenuModal>
    <ArangementMenu ref="arangementMenu" />
  </div>
</template>

<script>
import MenuModal from './MenuModal.vue'
import ArangementMenu from './ArangementMenu.vue'

import { mapGetters } from 'vuex'

import { defineAsyncComponent } from 'vue'
const ActionIcon = defineAsyncComponent(() => import(/* webpackChunkName: 'action-icons' */ '@/components/icons/ActionIcon'))


export default {
  name: "ContextMenu",
  components: {
    MenuModal,
    ArangementMenu,
    ActionIcon
  },
  data() {
    return {
      resolvePromise: undefined,
      menuActions: [],
    }
  },
  computed: {
    ...mapGetters({
      canPaste: 'clipboard/hasContents',
    }),
  },
  methods: {
    show(opts) {
      this.$refs.menu.open(opts.cursorPos)
      this.menuActions = opts.menuActions

      // send response to promise when context menu closed from MenuModal
      // so we dont have unresolved promises '.then()'
      this.$refs.menu.onunfocus = () => {
        this.resolvePromise(undefined)
      }

      // return promise
      return new Promise((resolve) => {
        this.resolvePromise = resolve
      })
    },
    menuAction(action) {
      if (action === 'ARANGEMENT') {
        // open arangement menu
        const menuPosition = this.$refs.menu.getMenuSize()
        this.$refs.arangementMenu.show(menuPosition).then((arangementAction) => {
          // pass ArangementMenu action to ContextMenu action handler, this
          // includes the close (undefined) action which will propagate and
          // close ContextMenu
          this.menuAction(arangementAction)
        })
      } else {
        this.resolvePromise(action)
        this.$refs.menu.close()
      }
    }
  }
};
</script>
