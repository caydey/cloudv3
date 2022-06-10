<template>
  <div id="banner">
    <span>
      {{ error }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ErrorPanel',
  components: {
  },
  props: [
    'error'
  ]
}
</script>

<style lang="scss" scoped>
#banner {
  background-color: $color-warning;

  padding: 14px;
  span {
    color: white;
  }
}
</style>
