<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    version="1.1"
    viewBox="0 0 16 16"
  >
    <!-- up -->
    <template v-if="icon === 'up'">
      <path
        style="fill: currentColor"
        d="M 7,14 V 6 L 3.5,9.5 2,8 8,2 14,8 12.5,9.5 9,6 V 14 Z"
      />
    </template>

    <!-- previous -->
    <template v-else-if="icon === 'previous'">
      <path
        style="fill: currentColor"
        d="M 14,7 H 6 L 9.5,3.5 8,2 2,8 8,14 9.5,12.5 6,9 H 14 Z"
      />
    </template>

    <!-- next -->
    <template v-else-if="icon === 'next'">
      <path
        style="fill: currentColor"
        d="M 2,9 H 10 L 6.5,12.5 8,14 14,8 8,2 6.5,3.5 10,7 H 2 Z"
      />
    </template>

    <!-- harddisk -->
    <template v-else-if="icon === 'harddisk'">
      <path
        style="fill: currentColor"
        d="M 3,1 C 2,1 2,2 2,2 V 14 C 2,14 2,15 3,15 H 13 C 13,15 14,15 14,14 V 2 C 14,2 14,1 13,1 Z M 8,3 C 10.21,3 12,4.79 12,7 12,9.21 10.21,11 8,11 H 4 V 7 C 4,4.79 5.79,3 8,3 Z M 8,5 C 6.9,5 6,5.9 6,7 6,8.1 6.9,9 8,9 9.1,9 10,8.1 10,7 10,5.9 9.1,5 8,5 Z"
      />
    </template>
  </svg>
</template>

<script>
export default {
  name: 'ToolbarIcon',
  props: [
    'icon'
  ],
}
</script>
