<template>
  <img class="openPanelContainer" :src="file.location" alt="could not load" />
</template>

<script>
export default {
  name: 'ImagePanel',
  mimes: [
    'image/jpeg',
    'image/png',
    'image/gif'
  ],
  props: [
    'file'
  ]
}
</script>