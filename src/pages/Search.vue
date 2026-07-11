<template>
    <page paddingless>
       <template #title>Search</template>

       <form class="mx-4 flex gap-3" @submit.prevent="onSubmit">
        <input 
        type="text"
        v-model="inputValue"
        placeholder="Найти Фильм По Названию..."
        class="w-80 max-w-full rounded-lg bg-movie-black-200 px-4 py-2 text-white 
        placeholder-gray-600 outline-none focus:ring-2 focus:ring-oranje" />

        <button type="submit" class="rounded-lg bg-oranje px-5 py-2 font-semibold text-white transition-opacity disabled:opacity-50" :disabled="store.isSearching || !inputValue.trim()">
            {{ store.isSearching ? 'Ищем...' : 'Искать' }}
        </button>
       </form>


       <div class="mx-4 mt-8">
        <p v-if="store.searchError" class="text-red-500">
            {{ store.searchError }}
        </p>

        <p v-else-if="store.hasSearched && !store.isSearching && !store.searchResults.length" class="text-gray-600">
            Ничего не Нашлось По Запросу <<{{ store.searchTerm }}>>
        </p>

        <div class="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <movie-search-card 
            v-for="movie in store.searchResults"
            :key="movie.id"
            v-bind:movie
            />
        </div>
       </div>
    </page>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import Page from '../components/layout/Page.vue';
import MovieSearchCard from '../components/MovieSearchCard.vue';
import { useMovieStore } from '../mocks/movies.ts';

const store = useMovieStore()
const inputValue = ref('')

const onSubmit = () => {
    store.searchMovies(inputValue.value)
}


    
</script>

