<template>
    <div class="volume-container bg-gray-600 absolute rotate-270 bottom-2/4 -right-10 flex p-4 rounded-lg bg-opacity-10">
        <SpeakerWaveIcon v-if="volumeLevel" @click="volumeLevel = 0" class="rotate-90 mr-4 text-white w-6.25"/>
        <SpeakerXMarkIcon v-else @click="volumeLevel = 50" class="rotate-90 text-white mr-4 w-6.25"/>
        <input type="range" class="volume-slider h-4.5 w-full outline-none self-center opacity-70 cursor-pointer rounded-lg" min="0" max="100" @change="adjustLevel" @mouseleave="adjustLevel" v-model="volumeLevel">

    </div>
</template>

<script setup lang="ts">
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/vue/24/outline';
import {computed, ref} from 'vue'
  const volumeLevel = ref(50)


  const soundLevel = computed(() => `${volumeLevel.value}% 100%`)


  const emits = defineEmits<{
    'on-volume-change': [value: number]
  }>()

  const adjustLevel = () => {
    emits('on-volume-change', volumeLevel.value / 100)
  }
</script>

<style>

.volume-slider {
 -webkit-appearance: none;
  appearance: none;
  background-image: linear-gradient(var(--color-oranje), var(--color-oranje));
 background-size: v-bind(soundLevel) ;
  background-repeat: no-repeat;
}

</style>