<template>
  <MenuModal ref="menu">
    <!-- NEW_FOLDER -->
    <template v-if="menuActions.includes('NEW_FOLDER')">
      <div class="row" @click="clipboardAction('NEW_FOLDER')">
        <SvgIcon class="icon" icon="folder-new" />
        <span>Create Folder...</span>
      </div>
    </template>

    <!-- UPLOAD -->
    <template v-if="menuActions.includes('UPLOAD')">
      <div class="row" @click="clipboardAction('UPLOAD')">
        <SvgIcon class="icon" icon="upload" />
        <span>Upload Files...</span>
      </div>
      <div class="rowBreak"></div>
    </template>

    <!-- OPEN -->
    <template v-if="menuActions.includes('OPEN')">
      <div class="row" @click="clipboardAction('OPEN')">
        <SvgIcon class="icon" icon="open" />
        <span>Open</span>
      </div>
      <div class="rowBreak" />
    </template>

    <!-- COPY -->
    <template v-if="menuActions.includes('COPY')">
      <div class="row" @click="clipboardAction('COPY')">
        <SvgIcon class="icon" icon="copy" />
        <span>Copy</span>
      </div>
    </template>

    <!-- CUT -->
    <template v-if="menuActions.includes('CUT')">
      <div class="row" @click="clipboardAction('CUT')">
        <SvgIcon class="icon" icon="cut" />
        <span>Cut</span>
      </div>
    </template>

    <!-- PASTE -->
    <template v-if="menuActions.includes('PASTE')">
      <div
        class="row"
        :class="{ disabled: !canPaste }"
        @click="canPaste && clipboardAction('PASTE')"
      >
        <SvgIcon class="icon" icon="paste" />
        <!-- Paste *Into Folder* if folder -->
        <span>Paste</span>
      </div>
    </template>

    <!-- PASTE INTO FOLDER -->
    <template v-if="menuActions.includes('PASTE_INTO')">
      <div
        class="row"
        :class="{ disabled: !canPaste }"
        @click="canPaste && clipboardAction('PASTE')"
      >
        <SvgIcon class="icon" icon="paste" />
        <!-- Paste *Into Folder* if folder -->
        <span>Paste Into Folder</span>
      </div>
    </template>

    <!-- RENAME -->
    <template v-if="menuActions.includes('RENAME')">
      <div class="rowBreak" />
      <div class="row" @click="clipboardAction('RENAME')">
        <SvgIcon class="icon" icon="edit" />
        <span>Rename</span>
      </div>
    </template>

    <!-- DELETE -->
    <template v-if="menuActions.includes('DELETE')">
      <div class="row" @click="clipboardAction('DELETE')">
        <SvgIcon class="icon" icon="delete" />
        <span>Delete</span>
      </div>
    </template>

    <!-- DOWNLOAD -->
    <template v-if="menuActions.includes('DOWNLOAD')">
      <div class="row" @click="clipboardAction('DOWNLOAD')">
        <SvgIcon class="icon" icon="download" />
        <span>Download</span>
      </div>
    </template>

    <!-- PROPERTIES -->
    <template v-if="menuActions.includes('PROPERTIES')">
      <div class="rowBreak" />
      <div class="row" @click="clipboardAction('PROPERTIES')">
        <SvgIcon class="icon" icon="properties" />
        <span>Properties...</span>
      </div>
    </template>
  </MenuModal>
</template>

<script>
import MenuModal from './MenuModal.vue'


import SvgIcon from '@/components/SvgIcon'

import { mapGetters } from 'vuex'

export default {
  name: "ContextMenu",
  components: {
    MenuModal,
    SvgIcon
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
      this.$refs.menu.onunfocus = () => {
        this.resolvePromise(undefined)
      }

      // return promise
      return new Promise((resolve) => {
        this.resolvePromise = resolve
      })
    },
    clipboardAction(action) {
      this.resolvePromise(action)
      this.$refs.menu.close()
    }
  }
};
</script>

<style lang="scss">
// change color of svg
.disabled path {
  color: $color-text-disabled;
}
</style>

<style lang="scss" scoped>
.rowBreak {
  margin: 2px 0; // top/bottom
  padding: 0;
  border: 1px solid $color-border;
}

.row {
  display: block;
  padding: 2px 6px; // top/bottom left/right
  margin: 0;
  &:hover {
    background-color: $color-active;
  }
}
.disabled {
  span {
    color: $color-text-disabled;
  }
  &:hover {
    background-color: $color-popup;
  }
}

.icon {
  position: relative;
  top: 2px; // move icon down 2 pixels
  margin-right: 8px;
}
</style>
