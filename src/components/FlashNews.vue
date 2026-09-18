<script setup lang="ts">
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/vue/24/solid'
import Stack from './layout/Stack.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useMovieStore } from '../store/movies.ts'

const store = useMovieStore()

onMounted(() => {
  if (!store.flashNewsMovie) {
    store.fetchFlashNews()
  }
})

const isBackDirection = ref<boolean>(false)
const currentSlideIndex = ref<number>(0)

const frames = computed(() => store.flashNewsMovie?.frames || [])
const currentFrame = computed(() => frames.value[currentSlideIndex.value])
const isLastSlide = computed(() => currentSlideIndex.value >= frames.value.length - 1)

const nextSlide = () => {
  if (isLastSlide.value) return
  isBackDirection.value = false
  toggleLoading()
  currentSlideIndex.value++
}

const prevSlide = () => {
  if (currentSlideIndex.value === 0) return
  isBackDirection.value = true
  toggleLoading()
  currentSlideIndex.value--
}

const loading = ref<boolean>(false)
const toggleLoading = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 300)
}

watch(() => store.bannerMovie, (val) => console.log('bannerMovie:', val))
</script>

<template>
  <stack v-if="store.flashNewsMovie">
    <transition :name="!isBackDirection ? 'slide-fade' : 'slide-fade-reverse'">
      <div v-show="!loading" class="w-full bg-white rounded-2xl p-6 drop-shadow-md rotate-3">
        <div class="news-top">
          <img :src="currentFrame" class="rounded-2xl" alt="Кадр из фильма" />
          <h2 class="text-oranje mt-2 font-bold text-m">🔥 Кадры</h2>
          <p class="mt-2 font-bold">{{ store.flashNewsMovie.title }}</p>
        </div>

        <div class="news-footer mt-4 flex">
          <p class="text-gray-400 w-full">
            {{ store.flashNewsMovie.year }} · ★ {{ store.flashNewsMovie.rate }}
          </p>
          <p class="text-gray-900 flex">
            <ArrowLeftIcon v-if="currentSlideIndex > 0" class="w-6 ml-2" @click="prevSlide" />
            {{ currentSlideIndex + 1 }}/{{ frames.length }}
            <ArrowRightIcon v-if="!isLastSlide" class="w-6 ml-2" @click="nextSlide" />
            <div class="w-6 ml-2" v-else></div>
          </p>
        </div>
      </div>
    </transition>
  </stack>
</template>


<style>
.slide-fade-enter-active,
.slide-fade-reverse-enter-active,
.slide-fade-reverse-leave-active,
.slide-fade-leave-active {
  transition: all .3s ease;
}

.slide-fade-enter {
  transform: translateX(100px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-100px);
  opacity: 0;
}


/* Back Scrolling */
.slide-fade-reverse-enter {
  transform: translateX(-100px);
  opacity: 0;
}
.slide-fade-reverse-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>