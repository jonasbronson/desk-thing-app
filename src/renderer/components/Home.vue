<script lang="ts">

export default {
    
}

</script>

<template>
    <h1>Hello Little Stylus! <a>... Hello Mario</a></h1>
    <div class="app-container">
        
    </div>
</template>

<style scoped>
    a {
        font-size: .5rem;
    }

    .app-container{
        display:grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
</style>