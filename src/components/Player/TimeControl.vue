<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  isActive: boolean
  videoDuration: number
  currentVideoPosition: number
}>()
const timeBar = ref<number>(0)

const emits = defineEmits<{ 'on-time-change': [value: number] }>()

const updateTimeBar = (event: Event) => {
  const currentTarget = event.target as HTMLInputElement
  timeBar.value = +currentTarget.value
  emits('on-time-change', timeBar.value)
}

const calculateTime = (duration: number) => {
  const seconds = Math.floor(duration % 60)
  const minutes = Math.floor(duration / 60)
  const computedSeconds = seconds >= 10 ? seconds : `0${seconds}`

  return `${minutes}:${computedSeconds}`
}

const currentTime = computed(() => calculateTime(props.currentVideoPosition))
const timeTotal = computed(() => calculateTime(props.videoDuration))

const range = computed(() => {
  const percent = (
    (props.currentVideoPosition / props.videoDuration) *
    100
  ).toFixed(2)

  return `${percent}% 100%`
})
</script>

<template>
  <div
    v-bind="$attrs"
    class="group flex w-full px-8 m-0 opacity-70 invisible transition-all duration-500 -translate-y-[55px] select-none"
    :class="{ 'opacity-100 visible': isActive }"
  >
    <time class="text-white mr-4 self-center opacity-70 transition-opacity duration-300 group-hover:opacity-100">
      {{ currentTime }}
    </time>

    <input
      type="range"
      class="time-track w-full h-2 self-center opacity-70 transition-opacity duration-300 group-hover:opacity-100"
      :min="0"
      step="1"
      :max="videoDuration"
      :value="currentVideoPosition"
      @input="updateTimeBar"
    />

    <time class="text-white ml-4 self-center opacity-70 transition-opacity duration-300 group-hover:opacity-100">
      {{ timeTotal }}
    </time>
  </div>
</template>

<style>
/* Чистый CSS для кастомного input-range — полная совместимость с Tailwind v4 */
.time-track {
  -webkit-appearance: none;
  appearance: none;
  
  /* Эффект закрашивания: первый цвет оранжевый (активный), второй — серый из твоей темы (неактивный) */
  background-image: linear-gradient(var(--color-oranje), var(--color-oranje)), 
                    linear-gradient(var(--color-movie-black-200), var(--color-movie-black-200));
  background-repeat: no-repeat;
  
  /* Благодаря этому свойству оранжевый градиент занимает место согласно v-bind(range), а серый остается на фоне */
  background-size: v-bind(range), 100% 100%;
  
  border-radius: 8px;
  outline: none;
  cursor: pointer;
}

/* Стилизация бегунка для Chrome, Safari, Edge */
.time-track::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 8px;
  background-color: var(--color-oranje);
  cursor: pointer;
  border: none;
}

/* Стилизация бегунка для Firefox */
.time-track::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 8px;
  background-color: var(--color-oranje);
  cursor: pointer;
  border: none;
}
</style>