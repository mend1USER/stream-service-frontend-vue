<template>
  <div v-if="store.isLoading" class="flex h-full min-w-0 flex-1 items-center justify-center text-gray-400">
    Загружаем информацию о фильме...
  </div>

  <p v-else-if="store.movieError" class="mx-4 mt-8 text-red-500">
    {{ store.movieError }}
  </p>

  <div v-else-if="store.currentMovie" class="h-full min-w-0 flex-1 overflow-y-auto bg-movie-black-200">
    <!-- Hero / Backdrop -->
    <div class="relative h-[62vh] w-full overflow-hidden">
      <img
        v-if="store.currentMovie.backdrop"
        :src="store.currentMovie.backdrop"
        :alt="store.currentMovie.title"
        class="h-full w-full object-cover"
      />
      <div v-else class="h-full w-full bg-movie-black-300"></div>

      <div class="absolute inset-0 bg-gradient-to-t from-movie-black-200 via-movie-black-200/60 to-movie-black-200/10"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-movie-black-200/95 via-movie-black-200/10 to-transparent"></div>

      <div class="film-sprockets pointer-events-none absolute inset-x-0 top-0 z-0"></div>
      <div class="film-sprockets pointer-events-none absolute inset-x-0 bottom-0 z-0"></div>
    </div>

    <!-- Title block -->
    <div class="relative z-20 mx-auto -mt-48 flex max-w-6xl flex-col gap-8 px-4 md:flex-row">
      <!-- Poster -->
      <img
        v-if="store.currentMovie.poster"
        :src="store.currentMovie.poster"
        :alt="store.currentMovie.title"
        class="reveal w-40 shrink-0 rounded-lg shadow-2xl ring-1 ring-white/10 md:w-56"
      />
      <div
        v-else
        class="reveal flex aspect-[2/3] w-40 shrink-0 items-center justify-center rounded-lg bg-movie-black-300 text-sm text-gray-500 md:w-56"
      >
        Нет постера
      </div>

      <div class="reveal reveal--delay-1 flex flex-1 flex-col gap-4 text-white">
        <div>
          <p v-if="store.currentMovie.genres?.length" class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-oranje">
            {{ store.currentMovie.genres.join(' · ') }}
          </p>
          <h1 class="text-3xl font-bold leading-tight md:text-5xl">
            {{ store.currentMovie.title }}
          </h1>
          <p v-if="store.currentMovie.originalTitle" class="mt-1 text-sm text-gray-500">
            {{ store.currentMovie.originalTitle }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400">
          <span v-if="store.currentMovie.year">{{ store.currentMovie.year }}</span>
          <span v-if="store.currentMovie.runtime && store.currentMovie.runtime !== '0'" class="flex items-center gap-3">
            <span class="text-gray-700">•</span>{{ formatRuntime(store.currentMovie.runtime) }}
          </span>
          <span v-if="store.currentMovie.released" class="flex items-center gap-3">
            <span class="text-gray-700">•</span>{{ store.currentMovie.released }}
          </span>
        </div>

        <p v-if="store.currentMovie.tagline" class="max-w-xl text-gray-500 italic">
          — {{ store.currentMovie.tagline }}
        </p>

        <div class="mt-1 flex flex-wrap items-center gap-6">
          <!-- Rating ring -->
          <div v-if="store.currentMovie.ratingImdb" class="flex items-center gap-3">
            <div class="relative h-16 w-16 shrink-0" :class="ratingColorClass">
              <svg viewBox="0 0 72 72" class="h-16 w-16 -rotate-90">
                <circle cx="36" cy="36" r="30" fill="none" stroke="currentColor" stroke-opacity="0.15" stroke-width="6" />
                <circle
                  cx="36"
                  cy="36"
                  r="30"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="6"
                  stroke-linecap="round"
                  :stroke-dasharray="ringCircumference"
                  :stroke-dashoffset="ringOffset"
                  class="ring-progress"
                />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-lg font-bold leading-none">
                {{ store.currentMovie.ratingImdb }}
              </span>
            </div>
            <div class="text-sm text-gray-500">
              <p>Рейтинг TMDB</p>
              <p v-if="store.currentMovie.voteCount">{{ store.currentMovie.voteCount.toLocaleString('ru-RU') }} голосов</p>
            </div>
          </div>

          <a
            v-if="store.currentMovie.trailer"
            :href="store.currentMovie.trailer"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-full bg-oranje py-2.5 pl-3 pr-5 font-semibold text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            Трейлер
          </a>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div class="reveal reveal--delay-2 mx-auto mt-12 max-w-6xl px-4 pb-16">
      <div class="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
        <!-- Main column -->
        <div class="flex flex-col gap-12">
          <div>
            <h2 class="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">Описание</h2>
            <p class="max-w-2xl leading-relaxed text-gray-300">
              {{ store.currentMovie.plot || 'Описание отсутствует' }}
            </p>
          </div>

          <movie-cast v-if="store.currentMovie.actors?.length" :actors="store.currentMovie.actors" />
        </div>

        <!-- Dossier sidebar -->
        <aside class="h-fit overflow-hidden rounded-xl bg-movie-black-300/60 ring-1 ring-white/5">
          <div class="clapperboard-bar"></div>
          <div class="px-5 py-2">
            <h2 class="py-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Досье</h2>
            <div class="flex flex-col">
              <fact-row v-if="store.currentMovie.director" label="Режиссёр" :value="store.currentMovie.director" />
              <fact-row v-if="store.currentMovie.writer" label="Сценарист" :value="store.currentMovie.writer" />
              <fact-row
                v-if="hasMoney(store.currentMovie.budget)"
                label="Бюджет"
                :value="formatMoney(store.currentMovie.budget)"
              />
              <fact-row
                v-if="hasMoney(store.currentMovie.boxOffice)"
                label="Сборы"
                :value="formatMoney(store.currentMovie.boxOffice)"
              />
              <fact-row v-if="spokenLanguages.length" label="Языки" :value="spokenLanguages.join(', ')" />
            </div>

            <div v-if="store.currentMovie.productionCompanies?.length" class="border-t border-white/5 py-5">
              <h3 class="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600">Производство</h3>
              <div class="flex flex-wrap items-center gap-5">
                <img
                  v-for="company in store.currentMovie.productionCompanies"
                  :key="company.name"
                  :src="company.logo"
                  :alt="company.name"
                  :title="company.name"
                  class="h-7 max-w-[100px] object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMovieStore } from '../mocks/movies.ts'
import FactRow from '../components/FactRow.vue'
import MovieCast from '../components/MovieCast.vue'

const props = defineProps<{ id: string }>()
const route = useRoute()
const store = useMovieStore()

onMounted(() => {
  store.fetchMovie(props.id)
})

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      ringAnimated.value = false
      store.fetchMovie(newId as string)
    }
  }
)

// Rating ring
const RADIUS = 30
const ringCircumference = 2 * Math.PI * RADIUS
const ringAnimated = ref(false)

watch(
  () => store.currentMovie?.ratingImdb,
  (val) => {
    if (!val) return
    ringAnimated.value = false
    requestAnimationFrame(() => requestAnimationFrame(() => (ringAnimated.value = true)))
  },
  { immediate: true }
)

const ringOffset = computed(() => {
  const rate = Number(store.currentMovie?.ratingImdb || 0)
  const fraction = Math.min(Math.max(rate / 10, 0), 1)
  return ringAnimated.value ? ringCircumference * (1 - fraction) : ringCircumference
})

const ratingColorClass = computed(() => {
  const rate = Number(store.currentMovie?.ratingImdb || 0)
  if (rate >= 7) return 'text-green-500'
  if (rate >= 5) return 'text-yellow-500'
  return 'text-red-500'
})

const spokenLanguages = computed(() =>
  (store.currentMovie?.spokenLanguages || []).filter((lang) => Boolean(lang?.trim()))
)

const hasMoney = (value?: string | number) => Number(value) > 0

const formatRuntime = (runtime: string) => {
  const minutes = Number(runtime)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours ? `${hours} ч ${mins} мин` : `${mins} мин`
}

const formatMoney = (value?: string | number) => {
  const num = Number(value)
  return num ? `$${num.toLocaleString('ru-RU')}` : ''
}
</script>

<style scoped>
/* Film strip perforation, sits inside the hero, behind the poster */
.film-sprockets {
  height: 14px;
  background-color: rgba(0, 0, 0, 0.55);
  background-image: radial-gradient(circle, theme('colors.movie-black.200', #0b0b0d) 3px, transparent 3.5px);
  background-size: 22px 14px;
  background-position: 8px center;
}

/* Clapperboard striped header */
.clapperboard-bar {
  height: 10px;
  background: repeating-linear-gradient(
    -45deg,
    rgba(255, 255, 255, 0.9) 0,
    rgba(255, 255, 255, 0.9) 10px,
    rgba(20, 20, 20, 0.9) 10px,
    rgba(20, 20, 20, 0.9) 20px
  );
}

.ring-progress {
  transition: stroke-dashoffset 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.reveal {
  animation: reveal-in 0.5s ease-out both;
}
.reveal--delay-1 {
  animation-delay: 0.08s;
}
.reveal--delay-2 {
  animation-delay: 0.14s;
}

@keyframes reveal-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none;
  }
  .ring-progress {
    transition: none;
  }
}
</style>