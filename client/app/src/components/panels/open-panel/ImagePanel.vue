<template>
  <img class="openPanelContainer" :src="file.location" alt="could not load" />
</template>

<script>
export default {
  name: 'ImagePanel',
  props: [
    'file'
  ]
}
</script>