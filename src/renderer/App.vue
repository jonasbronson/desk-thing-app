<script lang="ts">
import Home from './components/Home.vue'

export default {
  components: {
    Home
  },
  data() {
    return {
      screenOff: false
    };
  },
  methods: {
   async turnOffScreen() {
      await window.ipcRenderer.invoke('turn-off-screen');
      this.screenOff = true;
      document.addEventListener('click', this.turnOnScreen);
    },
    async turnOnScreen() {
      await window.ipcRenderer.invoke('turn-on-screen');
      this.screenOff = false;
      document.removeEventListener('click', this.turnOnScreen);
    }
  },
}
</script>

<template>
  <Home/>
  <button @click="turnOffScreen">Turn Off Screen</button>
</template>

