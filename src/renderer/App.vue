<script lang="ts">
import { ref, computed, defineComponent } from 'vue'
import Home from './components/Home.vue'
import Clock from './components/Clock.vue';
import InfoBar from './components/InfoBar.vue';

export default defineComponent({
  components: {
    InfoBar,
    Home,
    Clock
  },
  setup() {
    const routes: Record<string, any> = {
      '/': Home,
      '/clock': Clock
    }

    const currentPath = ref(window.location.hash)

    window.addEventListener('hashchange', () => {
      currentPath.value = window.location.hash
    })

    const currentView = computed(() => {
      return routes[currentPath.value.slice(1) || '/'] || Home
    })

    return {
      currentView
    }
  }
})
</script>

<template>
  <InfoBar/>
  <component :is="currentView"/>
</template>

