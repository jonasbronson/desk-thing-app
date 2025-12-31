<script lang="ts">

export default {
    
}

</script>

<template>
    <h1>Hello Little Stylus! <a>... Hello Mario</a></h1>
    <div class="app-container">
        <div v-on:click="" class="app-option">
            <h3 v-on:click="$router.push( {path: '/timer'} )">Pomodoro Timer</h3>
        </div>
    </div>
</template>

<style scoped>
    a {
        font-size: .5rem;
    }

    h3 {
        text-align: center;
    }

    .app-container{
        display:grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }

    .app-option{
        background-color: #333;
        border-radius: 10px;
        height: 150px;
        align-content: center;
        cursor: pointer;
    }
</style>