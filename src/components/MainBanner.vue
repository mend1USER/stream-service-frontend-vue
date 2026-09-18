<script setup lang="ts">
import { computed, watch, onMounted } from 'vue'
import { useMovieStore } from '../store/movies.ts'

const store = useMovieStore()

onMounted(() => {
  if (!store.bannerMovie) {
    store.fetchBannerMovie()
  }
})

watch(() => store.bannerMovie, (val) => console.log('bannerMovie:', val))

const bg = computed(() =>
  store.bannerMovie?.backdrop ? `url(${store.bannerMovie.backdrop})` : ''
)
</script>

<template>
  <div
    v-if="store.bannerMovie"
    class="banner flex p-8 w-full rounded-2xl drop-shadow-xl cursor-pointer"
  >
    <div class="text-white self-end">
      <h1 class="text-4xl mb-2 font-bold">{{ store.bannerMovie.title }}</h1>
      <div class="mt-6 flex justify-between w-[30%]">
        <span>{{ store.bannerMovie.year }}</span>
        <span>★ {{ store.bannerMovie.rate }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.banner {
  background: linear-gradient(rgb(255 255 255 / 0%), #262c31d9), v-bind(bg);
  background-size: cover;
}
</style>