<script setup lang="ts">
import { onMounted } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

import { useMovieStore } from '../store/movies'
import MovieFeedCard from './MovieFeedCard.vue' // 👈 Используем новый компонент

const store = useMovieStore()

// Настройка количества слайдов в зависимости от ширины экрана
const breakpoints = {
  320: { itemsToShow: 1.8 },
  640: { itemsToShow: 3.2 },
  1024: { itemsToShow: 4.5 },
  1280: { itemsToShow: 5.5 }
}

onMounted(() => {
  if (!store.popularMovies.length) {
    store.fetchPopularMovies()
  }
})
</script>

<template>
  <div class="mt-6">
    <Carousel v-if="store.popularMovies.length" :breakpoints="breakpoints" :gap="12">
      <Slide v-for="movie in store.popularMovies" :key="movie.id">
        <MovieFeedCard :movie="movie" />
      </Slide>
    </Carousel>
  </div>
</template>

<style>
/* Если используете Tailwind v4 и возникнет ошибка с @apply pl-4,
   можно задать через чистое CSS-свойство: */
.carousel__viewport {
  padding-left: 1rem;
}
</style>