<script lang="ts">
    import { timeLeftDisplay, startTimer, stopTimer } from "../../services/timerService.ts";

    export default {
        data() {
            return {
                timeLeftDisplay,
            }
        },
        methods: {
            startTimer,
            stopTimer,
        },
    }

</script>

<template>
    <h3>{{ timeLeftDisplay }}</h3>
    <button v-on:click="startTimer()">Start Timer</button>
    <button v-on:click="stopTimer()">Stop Timer</button>
</template>