<script lang="ts">
    import { timeLeftDisplay, startTimer, startBreak, stopTimer, breakActive, timerActive } from "../../services/timerService.ts";

    export default {
        data() {
            return {
                timeLeftDisplay,
                breakActive,
                timerActive,
            }
        },
        methods: {
            startTimer,
            startBreak,
            stopTimer,
        },
    }

</script>

<template>
    <div class="timer-container">
        <h1>{{ timeLeftDisplay }}</h1>
        <div class="options">
            <div>
                <button v-show="!timerActive" v-on:click="startTimer()">Start Timer</button>
                <button v-show="timerActive" v-on:click="stopTimer()">Pause Timer</button>
            </div>
            <button v-on:click="startBreak()">Go To Break<br>(5 min)</button>
            <div>
                <button v-show="timerActive" v-on:click="stopTimer()">Stop Timer</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
    h1 {
        font-size: 5rem;
        text-align: center;
        margin: 0;
    }
    button {
        padding: 1rem 2rem;
        font-size: 1.5rem;
        border: none;
        border-radius: 5px;
        background-color: #555;
        color: white;
        cursor: pointer;
    }
    .options {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
    }
    .timer-container {
        margin-top: 2rem;
    }

</style>
