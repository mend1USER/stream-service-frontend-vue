<template>
    <router-link 
    :to="`movies/${movie.id}`"
    class="group block overflow-hidden rounded-xl bg-movie-black-200 transition-transform duration-200 hover:-translate-y-1"
    >
    <div class="relative aspect-[2/3] w-full overflow-hidden bg-movie-black-300">
        <img v-if="movie.poster" :src="movie.poster" :alt="movie.title" loading="lazy" class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div v-else class="flex h-full w-full items-center justify-center text-sm text-gray-500">
            Нет Постера
        </div>
        <span v-if="movie.rate" class="absolute right-2 top-2 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-oranje">
            ★{{ movie.rate }}
        </span>
    </div>

    <div class="p-3">
        <h3 class="line-clamp-2 text-sm font-semibold text-white" :title="movie.title">
            {{ movie.title }}
        </h3>
        <p class="mt-1 text-xs text-gray-500">{{ movie.year }}</p>
    </div>
    </router-link>
</template>

<script setup lang="ts">
import type { MovieSearchResult } from '../mocks/movies';


defineProps<{
    movie: MovieSearchResult
}>()


</script>

<style scoped>

</style>