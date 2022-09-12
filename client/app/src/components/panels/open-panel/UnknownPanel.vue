<template>
  <div class="openPanelContainer">
    <p>Unsupported file type: {{ file.mime }}</p>

    <p>
      <a :href="file.location" target="_blank">Open in Browser</a>
    </p>
    <p>
      <a :href="file.location" download>Download</a>
    </p>
  </div>
</template>

<script>
export default {
  name: 'UnknownPanel',
  components: {
  },
  props: [
    'file'
  ]
}
</script>

<style lang="scss" scoped>
</style>
