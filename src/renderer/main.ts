import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import Home from './components/Home.vue'
import Clock from './components/Clock.vue'
import PomodoroTimer from './components/PomodoroTimer.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/clock', component: Clock },
  { path: '/timer', component: PomodoroTimer },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

createApp(App).use(router).mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message)
  })
})
