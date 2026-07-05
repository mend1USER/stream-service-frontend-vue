<template>

<div ref="player" class="relative w-full rounded-lg aspect-video object-cover cursor-pointer">
    <video 
    class="block w-full h-full aspect-video shadow-sm cursor-pointer bg-[var(--color-movie-black-200)]" 
    src="../../assets/video.mp4" 
    controls 
    autoplay
    preload="auto" 
    ref="video" 
    allowfullscreen 
    type="video/mp4" 
    @loadedmetadata="setVideoData"
    @progress="progress"
    @timeupdate="progress"
    />
    <time-control :video-duration="videoDuration" :current-video-position="videoCurrentTime" :is-active="true" @on-time-change="onTimeChange"/>
    <volume-control @on-volume-change="onVolumeChange"/>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TimeControl from './TimeControl.vue';
import VolumeControl from './VolumeControl.vue';

const videoDuration = ref<number>(0)
    const videoCurrentTime = ref<number>(0)
const video = ref()
const player = ref()



const setVideoData = () => {
    if(video.value.readyState) {
        videoDuration.value = video.value.duration
    }
}

const progress = () => {
    videoCurrentTime.value = video.value.currentTime
}

const onTimeChange = (value: number) => {
    video.value.currentTime = value
    progress()
}

const onVolumeChange = (value: number) => {
  video.value.volume = value
}
</script>

<style>


 ::-webkit-media-controls {
    display: none;
 }
</style>