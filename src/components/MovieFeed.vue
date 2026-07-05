<template>
    <div class="mt-5">
      <carousel :items-to-show="3.5">
        <slide v-for="movie in movies" :key="movie.id">
            <movie-card v-bind="movie">
        
        </movie-card>
        </slide>
      </carousel>
    </div>
</template>
 
<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, } from 'vue3-carousel';
import { movies } from '../mocks/movies';
import MovieCard from './MovieCard.vue';
</script>

<style scoped>

</style>