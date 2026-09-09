<template>
  <div class="flex h-full min-w-0 flex-1 flex-col items-center justify-center bg-[var(--color-movie-black-200)] p-0 text-white sm:p-6">

    <div v-if="store.isTorrentLoading" class="flex flex-col items-center gap-4">
      <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-oranje"></div>
      <p class="text-gray-400">Инициализируем торрент и подключаемся к пирам...</p>
    </div>

    <div v-else-if="store.torrentError" class="text-center">
      <p class="mb-4 text-lg font-semibold text-red-500">{{ store.torrentError }}</p>
      <button @click="startStream" class="rounded-lg bg-oranje px-5 py-2 font-semibold transition hover:bg-orange-600">
        Попробовать снова
      </button>
    </div>

    <!-- Плеер -->
    <div
      v-else
      ref="playerContainer"
      class="player-shell group relative aspect-video w-full max-w-6xl overflow-hidden bg-black shadow-2xl sm:rounded-xl"
      @mousemove="wakeControls"
      @mouseleave="scheduleHide"
      @click="handleShellClick"
    >
      <video
        ref="video"
        class="block h-full w-full"
        :src="videoUrl"
        autoplay
        preload="auto"
        @loadedmetadata="setVideoData"
        @progress="progress"
        @timeupdate="progress"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @waiting="isBuffering = true"
        @playing="isBuffering = false"
        @click.stop="togglePlay"
      />

      <div v-if="isBuffering" class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
        <div class="h-10 w-10 animate-spin rounded-full border-b-2 border-white/80"></div>
      </div>

      <div
        class="controls-fade pointer-events-none absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/70 to-transparent p-4 sm:p-5"
        :class="showControls ? 'opacity-100' : 'opacity-0'"
      >
        <button
          @click.stop="goBack"
          class="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/40 transition hover:bg-black/60"
          aria-label="Назад"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M15.5 4.5 8 12l7.5 7.5 1.4-1.4L10.8 12l6.1-6.1z" /></svg>
        </button>
        <h1 v-if="store.currentMovie?.title" class="truncate text-sm font-semibold text-gray-100 sm:text-base">
          {{ store.currentMovie.title }}
        </h1>
      </div>

      <button
        v-if="!isBuffering"
        @click.stop="togglePlay"
        class="pointer-events-none absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-black/45 backdrop-blur-sm transition-opacity duration-200"
        :class="showBigButton ? 'opacity-100' : 'opacity-0'"
        aria-label="Воспроизведение"
      >
        <svg v-if="!isPlaying" viewBox="0 0 24 24" class="h-7 w-7 translate-x-0.5" fill="white"><path d="M8 5v14l11-7z" /></svg>
        <svg v-else viewBox="0 0 24 24" class="h-7 w-7" fill="white"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
      </button>

      <div
        class="controls-fade pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
        :class="showControls ? 'opacity-100' : 'opacity-0'"
      ></div>

      <time-control
        class="absolute inset-x-0 bottom-0 z-10"
        :video-duration="videoDuration"
        :current-video-position="videoCurrentTime"
        :is-active="showControls"
        @on-time-change="onTimeChange"
      />

      <div
        class="controls-fade pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 px-8 py-3"
        :class="showControls ? 'opacity-100' : 'opacity-0'"
      >
        <div class="pointer-events-auto flex items-center gap-3">
          <button @click.stop="togglePlay" class="flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10" aria-label="Play/Pause">
            <svg v-if="!isPlaying" viewBox="0 0 24 24" class="h-5 w-5 translate-x-0.5" fill="white"><path d="M8 5v14l11-7z" /></svg>
            <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="white"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
          </button>

        </div>

        <button @click.stop="toggleFullscreen" class="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-white/10" aria-label="Полный экран">
          <svg v-if="!isFullscreen" viewBox="0 0 24 24" class="h-5 w-5" fill="white">
            <path d="M4 9V4h5v2H6v3H4zm16 0V4h-5v2h3v3h2zM4 15v5h5v-2H6v-3H4zm16 0v5h-5v-2h3v-3h2z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="white">
            <path d="M9 4H4v5h2V6h3V4zm11 0h-5v2h3v3h2V4zM4 20h5v-2H6v-3H4v5zm16 0v-5h-2v3h-3v2h5z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMovieStore } from '../store/movies.ts' 
import TimeControl from '../components/Player/TimeControl.vue'
// import VolumeControl from '../components/Player/VolumeControl.vue'

const route = useRoute()
const router = useRouter()
const store = useMovieStore()

const videoUrl = ref('')
const videoDuration = ref<number>(0)
const videoCurrentTime = ref<number>(0)
const video = ref<HTMLVideoElement | null>(null)
const playerContainer = ref<HTMLDivElement | null>(null)

const isPlaying = ref(false)
const isBuffering = ref(false)
const isFullscreen = ref(false)
const showControls = ref(true)
let hideTimer: ReturnType<typeof setTimeout> | null = null

const startStream = async () => {
  const magnet = route.query.magnet as string
  if (!magnet) return

  try {
    videoUrl.value = await store.initTorrentStream(magnet)
  } catch (err) {
    console.error('Не удалось запустить поток')
  }
}

const setVideoData = () => {
  if (video.value?.readyState) {
    videoDuration.value = video.value.duration
  }
}

const progress = () => {
  if (video.value) {
    videoCurrentTime.value = video.value.currentTime
  }
}

const onTimeChange = (value: number) => {
  if (video.value) {
    video.value.currentTime = value
    progress()
  }
}

// const onVolumeChange = (value: number) => {
//   if (video.value) {
//     video.value.volume = value
//   }
// }

const togglePlay = () => {
  if (!video.value) return
  if (video.value.paused) {
    video.value.play()
  } else {
    video.value.pause()
  }
  wakeControls()
}

const showBigButton = ref(false)
const syncBigButton = () => {
  showBigButton.value = !isPlaying.value
}

const toggleFullscreen = async () => {
  if (!playerContainer.value) return
  if (!document.fullscreenElement) {
    await playerContainer.value.requestFullscreen()
    isFullscreen.value = true
  } else {
    await document.exitFullscreen()
    isFullscreen.value = false
  }
}

const goBack = () => {
  router.back()
}

const wakeControls = () => {
  showControls.value = true
  if (hideTimer) clearTimeout(hideTimer)
  scheduleHide()
}

const scheduleHide = () => {
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    if (isPlaying.value) showControls.value = false
  }, 3000)
}

const handleShellClick = () => {
  wakeControls()
}

const onFullscreenChange = () => {
  isFullscreen.value = Boolean(document.fullscreenElement)
}

onMounted(() => {
  startStream()
  document.addEventListener('fullscreenchange', onFullscreenChange)
  scheduleHide()
})

onBeforeUnmount(() => {
  store.stopTorrentStream()
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  if (hideTimer) clearTimeout(hideTimer)
})

import { watch } from 'vue'
watch(isPlaying, syncBigButton, { immediate: true })
</script>

<style scoped>
.player-shell {
  cursor: default;
}

.controls-fade {
  transition: opacity 0.35s ease;
}

::-webkit-media-controls {
  display: none !important;
}
</style>