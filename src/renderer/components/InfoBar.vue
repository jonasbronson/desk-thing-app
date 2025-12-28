<script lang="ts">

import { getCurrentTime } from '../../services/clockService.ts';

export default {
    data() {
        return {
            time: getCurrentTime(),
            interval: null as any | null,
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
    created() {
        this.interval = setInterval(() => {
            this.time = getCurrentTime();
        }, 1000);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.turnOnScreen);
    },
    unmounted() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
    
}
</script>

<template>
    <div class="info-bar-container">
        <button @click="turnOffScreen" class="screen-off-button">Turn Off Screen</button>
        <h2><a href="#">DeskThingApp</a></h2>
        <h2><a href="#/clock">{{time}}</a></h2>
    </div>
</template>

<style scoped>

    h2 {
        font-size: 1rem;
        margin: 0;
        text-align: end;
    }

    h2 a {
        color: white;
        text-decoration: none;
    }

    .info-bar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        background-color: #333;
    }

    .screen-off-button {
        padding: 5px 10px;
        font-size: 0.8rem;
        cursor: pointer;
        background-color: #444;
        color: white;
        border: none;
        border-radius: 4px;
    }

</style>