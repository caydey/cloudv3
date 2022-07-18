<template>
  <div>
    <!-- checkbox-checked -->
    <template v-if="icon === 'checkbox-checked'">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwCwaJjyAAAAy0lEQVR4nGNgoAYwnnnL23jG7ScmM27/JxI/Nplx1wtuAESAaM0w/AjZAFI1gzFJBhhPufpfr3oteQaANCs5h/2XUVb7r1O8EL8BxlOu/DeedgNhwNRr/5VcI/9LK6n8l9Ux+W/Qsge3AcYTL/yXN7L+r2jr999o0kW8mnEbYGgF1qBo4/tfySUcp2acXjDoPAo0xBKsEaF5N2mxoFe3+b+Mijo40PQatpIXjfqNu/7r1qynXjogZAClSfmuF4mGPDKZdceTyLyKHwAA8hDnL2JgMGoAAAAASUVORK5CYII="
      />
    </template>
    <!-- checkbox-unchecked -->
    <template v-else-if="icon === 'checkbox-unchecked'">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwCwaJjyAAAAd0lEQVR4nGNgoAaQkJBQkJSUPSkhKf1HUlL6Pz4MUiMlJXtCUlJSHm6AtLTsKSVVzb/aBqb/icFKqhp/QYYgXAA0lVjNMAzSAzcA5DRSDQDpGTVgeBlAhYQkexKUPInVrKSiAcoPx5EMkJQHpW0SMtNxlMxECQAAT4keIXignyIAAAAASUVORK5CYII="
      />
    </template>

    <!-- radio-checked -->
    <template v-else-if="icon === 'radio-checked'">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwCwaJjyAAAA+ElEQVR4nGNgoDYwnXpfwnjG7TaTmbcumsy4/RWMQezpt1vNZ98Tx6vZZPqdCKCGz0D8Hwf+bDr9dhg+zf/waIbhf8Yzb4diOJuAzej4k970O2JItt9uJUEzGJtOv9OEMAASYCgKdEuX/ZfTM/8vp2/xX7dsKTZDziEMmHH7C7oCkEZpJRUwltO3xGbAR2QDMPxPhAEf4AYA4/0ChhfKloENAWnWLV+OzYCziFiYcaeZ1EAEBnwD3ABQlICihgQDPhjPvCmCmpBm3A4hMiH9NZt+JxB7aoQY8hGfzTg1w4DhvNuiwEBtBAUS1LCPpjNvnwH5GcPZ1AAANielKsvDXoUAAAAASUVORK5CYII="
      />
    </template>
    <!-- radio-unchecked -->
    <template v-else-if="icon === 'radio-unchecked'">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAA7DAAAOwwCwaJjyAAABD0lEQVR4nK2T4WrCMBSFfQrb5CaZqxXTWrEb85XEH2O+i6h/tqfbBH0AJ9gKmhNWlm5VWzBwISTnO7m5uWm17j3abdnlXH5wTluf0RHBmNwwpt49TwVXYSHEjHOx7/Z0rpOn02D0YgNzrGHPxFslbDZeSahdNDRgOq4M7EEDbQlmjD2YxW99BS4CGmjBuKcvglBnt+AioAXza0ByrZO0FmyzMFrDfLkZZDEKVtMAhQXjGhyaGMT/DEw6za8gPt0M5o9hv3YRoQXjGHCJp4mGzzfh6OcZwfzpQjUhUjudXDbBAdBAW9mNRHKKdg3Cfo57olixbeW0SHsPTSVcDN/3O+YjrVBYVNqGndOy1H33GmeNRezCklHZuQAAAABJRU5ErkJggg=="
      />
    </template>

    <!-- svg icons -->
    <template v-else>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        version="1.1"
        viewBox="0 0 16 16"
      >
        <!-- cut -->
        <template v-if="icon === 'cut'">
          <path
            style="fill: currentColor"
            d="M 4.5,2 C 3.12,2 2,3.12 2,4.5 2,5.88 3.12,7 4.5,7 4.95,7 5.36,6.86 5.72,6.66 L 7.69,8.5 5.72,10.34 C 5.36,10.14 4.95,10 4.5,10 3.12,10 2,11.12 2,12.5 2,13.88 3.12,15 4.5,15 5.88,15 7,13.88 7,12.5 7,12.27 6.96,12.06 6.91,11.84 L 9.03,9.78 13.5,14 H 15 V 13 L 6.91,5.16 C 6.96,4.95 7,4.73 7,4.5 7,3.12 5.88,2 4.5,2 Z M 4.5,3.5 C 5.05,3.5 5.5,3.95 5.5,4.5 5.5,5.05 5.05,5.5 4.5,5.5 3.95,5.5 3.5,5.05 3.5,4.5 3.5,3.95 3.95,3.5 4.5,3.5 Z M 13.5,3 9.56,6.72 10.88,8 15,4 V 3 Z M 4.5,11.5 C 5.05,11.5 5.5,11.95 5.5,12.5 5.5,13.05 5.05,13.5 4.5,13.5 3.95,13.5 3.5,13.05 3.5,12.5 3.5,11.95 3.95,11.5 4.5,11.5 Z"
          />
        </template>

        <!-- copy -->
        <template v-else-if="icon === 'copy'">
          <path
            style="fill: currentColor"
            d="M 3,1 C 3,1 2,1 2,2 V 11 C 2,11 2,12 3,12 H 4 V 3 H 12 V 2 C 12,1 11,1 11,1 Z M 6,4 C 6,4 5,4 5,5 V 15 C 5,16 6,16 6,16 H 14 C 14,16 15,16 15,15 V 5 C 15,4 14,4 14,4 Z M 7,6 H 13 V 14 H 7 Z"
          />
        </template>

        <!-- delete -->
        <template v-else-if="icon === 'delete'">
          <path
            style="fill: currentColor"
            d="M 6 1 C 5 1 5 2 5 2 L 2 2 C 2 2 1 2 1 3 L 1 4 L 14 4 L 14 3 C 14 2 13 2 13 2 L 10 2 C 10 2 10 1 9 1 L 6 1 z M 2 5 L 2 14 C 2 14.52 2.48 15 3 15 L 12 15 C 12.52 15 13 14.52 13 14 L 13 5 L 2 5 z M 4 7 L 4.90625 7 C 5.1896143 7 5.441896 7.094451 5.5878906 7.2226562 L 7.5 8.890625 L 9.4121094 7.2226562 C 9.5581045 7.0944527 9.810385 7 10.09375 7 L 11 7 L 11 7.7363281 C 11 7.9375667 10.918222 8.1210684 10.771484 8.25 L 8.7695312 10 L 10.771484 11.75 C 10.898603 11.861628 10.96343 12.04569 11 12.3125 L 11 13 L 10.09375 13 C 9.810385 13 9.5581045 12.90555 9.4121094 12.777344 L 7.5 11.099609 L 5.5878906 12.777344 C 5.441896 12.905551 5.1896143 13 4.90625 13 L 4 13 L 4 12.263672 C 4 12.062433 4.0819193 11.878734 4.2285156 11.75 L 6.2304688 10 L 4.2285156 8.25 C 4.0814864 8.1206723 4 7.9375667 4 7.7363281 L 4 7 z"
          />
        </template>

        <!-- paste -->
        <template v-else-if="icon === 'paste'">
          <path
            style="fill: currentColor"
            d="M 8 0 A 2 2 0 0 0 6 2 L 3 2 C 2.446 2 2 2.446 2 3 L 2 14 C 2 14.554 2.446 15 3 15 L 13 15 C 13.554 15 14 14.554 14 14 L 14 3 C 14 2.446 13.554 2 13 2 L 10 2 A 2 2 0 0 0 8 0 z M 8 1 A 1 1 0 0 1 9 2 A 1 1 0 0 1 8 3 A 1 1 0 0 1 7 2 A 1 1 0 0 1 8 1 z M 4 4 L 5 4 L 5 5 L 11 5 L 11 4 L 12 4 L 12 13 L 4 13 L 4 4 z"
          />
        </template>

        <!-- properties -->
        <template v-else-if="icon === 'properties'">
          <path
            style="fill: currentColor"
            d="M 1,1 V 3 H 15 V 1 Z M 1,5 V 7 H 15 V 5 Z M 1,9 V 11 H 15 V 9 Z M 1,13 V 15 H 15 V 13 Z"
          />
        </template>

        <!-- edit -->
        <template v-else-if="icon === 'edit'">
          <path
            style="fill: currentColor"
            d="M 12.778,1.2222 C 12.778,1.2222 12.278,0.72224 11.778,1.2222 L 10,3 13,6 14.778,4.2222 C 15.278,3.7222 14.778,3.2222 14.778,3.2222 Z M 9,4 1,12 V 15 H 4 L 12,7 Z"
          />
        </template>

        <!-- download -->
        <template v-else-if="icon === 'download'">
          <path
            style="fill: currentColor"
            d="M 6 2 L 6 6 L 3 6 L 8 14 L 13 6 L 10 6 L 10 2 L 6 2 z"
          />
        </template>

        <!-- open -->
        <template v-else-if="icon === 'open'">
          <path
            style="fill: currentColor"
            d="m 1.9999999,1.0000001 c 0,0 -1.00000005,0 -1.00000005,1 V 11 14 c 0,1 1.00000005,1 1.00000005,1 h 2 v -2 h -1 V 3.0097657 H 11 V 5.0000001 8 8 l 2.000003,-2.58e-4 v -1.7497423 -4.25 c 0,-1.00000001 -1,-1.00000001 -1,-1.00000001 z m 3.7148438,6 c 0,0 -0.7148438,-9.015e-4 -0.7148438,0.6914062 v 7.6171877 c 0,0 5.581e-4,0.691406 0.7148438,0.691406 H 14.285156 C 14.285156,16 15,16.000902 15,15.308594 V 9.6778675 C 15,8.9855593 14.285156,9.0001326 14.285156,9.0001326 H 10.714844 L 9.2851559,7.0000001 Z"
          />
        </template>

        <!-- upload -->
        <template v-else-if="icon === 'upload'">
          <path
            style="fill: currentColor"
            d="M 6,14 V 10 H 3 l 5,-8 5,8 h -3 v 4 z"
          />
        </template>

        <!-- folder-new -->
        <template v-else-if="icon === 'folder-new'">
          <path
            style="fill: currentColor"
            d="M 1,3 V 14 C 1,14 1,15 2,15 H 14 C 14,15 15,15 15,14 V 5 C 15,4 14,4 14,4 H 9 L 7,2 H 2 C 2,2 1,2 1,3 Z M 7,6 H 9 V 8 H 11 V 10 H 9 V 12 H 7 V 10 H 5 V 8 H 7 Z"
          />
        </template>

        <!-- folder-move -->
        <template v-else-if="icon === 'folder-move'">
          <path
            style="fill: currentColor; opacity: 0.35"
            d="M 12,7 V 11.25 C 12,12 11.25,12 11.25,12 H 5 V 14.25 C 5,15 5.75,15 5.75,15 H 14.25 C 14.25,15 15,15 15,14.25 V 7.75 C 15,7 14.25,7 14.25,7 Z"
          />
          <path
            style="fill: currentColor"
            d="M 1.75,1 C 1.75,1 1,1 1,1.75 V 10.25 C 1,11 1.75,11 1.75,11 H 10.25 C 10.25,11 11,11 11,10.25 V 3.75 C 11,3 10.25,3 10.25,3 H 7 L 5,1 Z"
          />
        </template>

        <!-- folder-copy -->
        <template v-else-if="icon === 'folder-copy'">
          <path
            style="fill: currentColor"
            d="M 1.75,1 C 1.75,1 1,1 1,1.75 V 10.25 C 1,11 1.75,11 1.75,11 H 10.25 C 10.25,11 11,11 11,10.25 V 3.75 C 11,3 10.25,3 10.25,3 H 7 L 5,1 Z M 12,7 V 11.25 C 12,12 11.25,12 11.25,12 H 5 V 14.25 C 5,15 5.75,15 5.75,15 H 14.25 C 14.25,15 15,15 15,14.25 V 7.75 C 15,7 14.25,7 14.25,7 Z"
          />
        </template>

        <!-- browser -->
        <template v-else-if="icon === 'browser'">
          <path
            style="fill: currentColor"
            d="M 8,1 C 4.13,1 1,4.13 1,8 1,11.87 4.13,15 8,15 11.87,15 15,11.87 15,8 15,4.13 11.87,1 8,1 Z M 7.5,2.94 C 7.57,2.93 7.65,2.94 7.72,2.94 7.73,2.97 7.67,3.08 7.59,3.25 7.11,4.31 7.08,5.55 7.53,6.22 7.61,6.34 7.69,6.45 7.69,6.47 7.69,6.48 7.6,6.5 7.5,6.5 7.27,6.5 7.05,6.36 6.59,6 6.39,5.84 6.13,5.71 6.03,5.69 5.87,5.66 5.83,5.67 5.63,5.87 5.43,6.07 5.38,6.17 5.38,6.34 5.38,7.01 6.16,7.53 7.63,7.84 9.61,8.26 10.1,8.64 10.16,9.69 10.23,11 9.53,11.99 8,12.75 7.82,12.84 7.7,12.88 7.63,12.91 7.59,12.9 7.57,12.91 7.53,12.91 7.52,12.87 7.5,12.77 7.5,12.59 7.5,11.9 7.23,11.18 6.81,10.78 6.7,10.67 6.39,10.45 6.13,10.28 5.86,10.12 5.59,9.93 5.53,9.84 5.43,9.71 5.42,9.63 5.5,9.37 5.64,8.92 5.8,8.66 6.13,8.37 6.29,8.22 6.46,8.1 6.5,8.09 6.54,8.09 6.29,8.01 5.91,7.94 5.53,7.86 4.97,7.7 4.69,7.59 4.16,7.4 3.46,7.01 3.19,6.72 3.18,6.71 3.17,6.7 3.16,6.69 3.54,5.15 4.63,3.89 6.06,3.28 6.36,3.15 6.67,3.07 7,3 7.16,2.97 7.33,2.95 7.5,2.94 Z M 12.19,5.28 C 12.31,5.35 12.75,6.31 12.88,6.78 13.04,7.39 13.03,8.43 12.88,9.03 12.82,9.26 12.74,9.47 12.72,9.5 12.69,9.53 12.61,9.37 12.5,9.19 12.4,9 12.06,8.61 11.78,8.31 10.98,7.46 10.85,7.02 11.19,6.34 11.36,6 12.1,5.23 12.19,5.28 Z"
          />
        </template>

        <!-- zoom-in -->
        <template v-else-if="icon === 'zoom-in'">
          <path
            style="fill: currentColor"
            d="M 3,2 C 2.45,2 2,2.446 2,3 V 13 C 2,13.554 2.45,14 3,14 H 13 C 13.55,14 14,13.554 14,13 V 3 C 14,2.446 13.55,2 13,2 Z M 7,5 H 9 V 7 H 11 V 9 H 9 V 11 H 7 V 9 H 5 V 7 H 7 Z"
          />
        </template>

        <!-- zoom-out -->
        <template v-else-if="icon === 'zoom-out'">
          <path
            style="fill: currentColor"
            d="M 3,2 C 2.45,2 2,2.446 2,3 V 13 C 2,13.554 2.45,14 3,14 H 13 C 13.55,14 14,13.554 14,13 V 3 C 14,2.446 13.55,2 13,2 Z M 5,7 H 11 V 9 H 5 Z"
          />
        </template>

        <!-- zoom-original -->
        <template v-else-if="icon === 'zoom-original'">
          <path
            style="fill: currentColor"
            d="M 3,2 C 2.45,2 2,2.446 2,3 V 13 C 2,13.554 2.45,14 3,14 H 13 C 13.55,14 14,13.554 14,13 V 3 C 14,2.446 13.55,2 13,2 Z M 7,5 H 9 V 11 H 7 V 7 H 6 V 6 C 6,6 7,6 7,5 Z"
          />
        </template>

        <!-- arangement -->
        <template v-else-if="icon === 'arangement'">
          <path
            style="fill: currentColor"
            d="M 11,1 8,5 H 10 V 8 H 12 V 5 H 14 Z M 2.5,2 A 1.5,1.5 0 0 0 1,3.5 1.5,1.5 0 0 0 2.5,5 1.5,1.5 0 0 0 4,3.5 1.5,1.5 0 0 0 2.5,2 Z M 2.5,6 A 1.5,1.5 0 0 0 1,7.5 1.5,1.5 0 0 0 2.5,9 1.5,1.5 0 0 0 4,7.5 1.5,1.5 0 0 0 2.5,6 Z M 7,7 V 10 H 5 L 8,14 11,10 H 9 V 7 Z M 2.5,10 A 1.5,1.5 0 0 0 1,11.5 1.5,1.5 0 0 0 2.5,13 1.5,1.5 0 0 0 4,11.5 1.5,1.5 0 0 0 2.5,10 Z"
          />
        </template>

        <!-- settings -->
        <template v-else-if="icon === 'settings'">
          <path
            style="fill: currentColor"
            d="M 6.25,1 6.09,2.84 A 5.5,5.5 0 0 0 4.49,3.77 L 2.81,2.98 1.06,6.01 2.58,7.07 A 5.5,5.5 0 0 0 2.5,8 5.5,5.5 0 0 0 2.58,8.93 L 1.06,9.98 2.81,13.01 4.48,12.22 A 5.5,5.5 0 0 0 6.09,13.15 L 6.25,15 H 9.75 L 9.9,13.15 A 5.5,5.5 0 0 0 11.51,12.22 L 13.19,13.01 14.94,9.98 13.41,8.92 A 5.5,5.5 0 0 0 13.5,8 5.5,5.5 0 0 0 13.42,7.06 L 14.94,6.01 13.19,2.98 11.51,3.77 A 5.5,5.5 0 0 0 9.9,2.84 L 9.75,1 Z M 8,6 A 2,2 0 0 1 10,8 2,2 0 0 1 8,10 2,2 0 0 1 6,8 2,2 0 0 1 8,6 Z"
          />
        </template>
      </svg>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ActionIcon',
  props: [
    'icon'
  ],
}
</script>

<style lang="scss" scoped>
div {
  display: inline;
}
</style>
