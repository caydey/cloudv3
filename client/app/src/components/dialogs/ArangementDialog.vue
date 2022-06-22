<template>
  <PopupModal ref="popup">
    <div id="dialog" class="shadow">
      <div id="container">
        <p class="title textCenter">Arange Items</p>
        <div class="row">
          <input
            type="radio"
            id="by_name"
            name="field"
            v-model="field"
            value="name"
          />
          <label for="by_name">By Name</label>
        </div>
        <div class="row">
          <input
            type="radio"
            id="by_size"
            name="field"
            v-model="field"
            value="size"
          />
          <label for="by_size">By Size</label>
        </div>
        <div class="row">
          <input
            type="radio"
            id="by_date"
            name="field"
            v-model="field"
            value="modified"
          />
          <label for="by_date">By Date</label>
        </div>

        <div class="rowBreak" />
        <div class="row">
          <input
            type="radio"
            id="ascending"
            name="order"
            v-model="order"
            value="ASCENDING"
          />
          <label for="ascending">Ascending</label>
        </div>
        <div class="row">
          <input
            type="radio"
            id="descending"
            name="order"
            v-model="order"
            value="DESCENDING"
          />
          <label for="descending">Descending</label>
        </div>

        <div class="rowBreak" />
        <div class="row">
          <input type="checkbox" id="foldersFirst" v-model="foldersFirst" />
          <label for="foldersFirst">Folders First</label>
        </div>
      </div>
      <div id="buttons">
        <button class="actionButton" @click="close">Close</button>
      </div>
    </div>
  </PopupModal>
</template>

<script>
import PopupModal from './PopupModal'

import { mapGetters } from 'vuex'

export default {
  name: "ArangementDialog",
  components: {
    PopupModal
  },
  data() {
    return {
      field: null,
      order: null,
      foldersFirst: null
    }
  },
  methods: {
    show() {
      // show popup
      this.$refs.popup.open()

      this.field = this.sortField
      this.order = this.sortAscending ? 'ASCENDING' : 'DESCENDING'
      this.foldersFirst = this.sortFoldersFirst
    },
    close() {
      this.$refs.popup.close()
    },
  },
  computed: {
    ...mapGetters({
      sortField: 'settings/sortField',
      sortAscending: 'settings/sortAscending',
      sortFoldersFirst: 'settings/sortFoldersFirst'
    })
  },
  watch: {
    field() {
      this.$store.commit('settings/setSortField', this.field)
    },
    order() {
      this.$store.commit('settings/setSortAscending', this.order === 'ASCENDING')
    },
    foldersFirst() {
      this.$store.commit('settings/setSortFoldersFirst', this.foldersFirst)
    }
  }
}
</script>

<style lang="scss" scoped>
#dialog {
  background-color: $color-popup;
  border-radius: 2px;
}
#container {
  padding: 10px;
}
.title {
  font-size: 20px;
  margin-bottom: 6px;
}
label {
  padding-left: 4px;
}
button {
  font-size: 18px;
  padding: 4px;
  width: 160px;
  border-radius: 4px;
}
.row {
  display: block;
}
.rowBreak {
  margin: 8px;
}
input {
  filter: hue-rotate(20deg); // blue
}
</style>