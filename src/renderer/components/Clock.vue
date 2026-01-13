<script lang="ts">

import { time } from '../../services/clockService.ts';

export default {
    data() {
        return {
            time,
        };
    },
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