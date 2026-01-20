<script lang="ts">
  import { defineComponent } from 'vue'
  import InfoBar from './components/InfoBar.vue';
  
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

