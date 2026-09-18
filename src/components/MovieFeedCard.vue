<script setup lang="ts">
// Импортируем тот же тип, что и в MovieSearchCard
import type { MovieSearchResult } from '../store/movies'

defineProps<{
  movie: MovieSearchResult
}>()
</script>

<template>
  <div class="group relative w-full max-w-[200px] mx-auto overflow-hidden rounded-xl bg-slate-900 border border-slate-800 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-500/10">
    
    <!-- Постер -->
    <div class="relative aspect-[2/3] w-full overflow-hidden bg-slate-800">
      <img
        v-if="movie.poster"
        :src="movie.poster"
        :alt="movie.title"
        class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="flex h-full w-full items-center justify-center text-xs text-slate-500">
        Нет постера
      </div>

      <!-- Рейтинг -->
      <div 
        v-if="movie.rate" 
        class="absolute top-2 right-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-xs font-bold text-amber-400 border border-slate-700/50 backdrop-blur-md"
      >
        ★ {{ movie.rate }}
      </div>
    </div>

    <!-- Инфо -->
    <div class="p-3 text-left">
      <h3 class="line-clamp-1 text-sm font-semibold text-slate-100 group-hover:text-indigo-400" :title="movie.title">
        {{ movie.title }}
      </h3>
      <p v-if="movie.year" class="mt-1 text-xs font-medium text-slate-400">
        {{ movie.year }}
      </p>
    </div>

  </div>
</template>