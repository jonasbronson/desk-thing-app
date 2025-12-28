<script lang="ts">

import { getCurrentTime } from '../../services/clockService.ts';

export default {
    data() {
        return {
            time: getCurrentTime(),
            interval: null as any | null,
        };
    },
    created() {
        this.interval = setInterval(() => {
            this.time = getCurrentTime();
        }, 1000);
    },
    unmounted() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

</script>

<template>
    <h1>{{ time }}</h1>
</template>

<style scoped>
    h1 {
        font-size: 5rem;
        text-align: center;
        transform: translateY(100%);
        margin: 0;
    }
</style>