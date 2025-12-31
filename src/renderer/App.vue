<script lang="ts">
  import { defineComponent } from 'vue'
  import InfoBar from './components/InfoBar.vue';
  import { RouterView } from 'vue-router'

  export default defineComponent({
    components: {
      InfoBar,
    },
  })
</script>

<template>
  <InfoBar/>
  <RouterView/>
</template>

