<script lang="ts">

export default {
    data() {
        return {
            time: this.getTime(),
            interval: null as any | null,
        };
    },
    methods: {
        getTime(): string {
            const now = new Date();
            return now.toLocaleTimeString();
        },
    },
    created() {
        this.interval = setInterval(() => {
            this.time = this.getTime();
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
    <h1>Welcome to Desk Thing App</h1>
    <h2>{{time}}</h2>

</template>