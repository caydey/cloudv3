<template>
  <audio class="openPanelContainer" autoplay controls>
    <source :src="file.location" alt="could not load">
  </audio>
</template>

<script>
export default {
  name: 'AudioPanel',
  props: [
    'file'
  ]
}
</script>