<template>
    <div>
       <nav class="flex space-x-4">
        <a 
        v-for="{id, emoji, title} in tabs" 
        :key="id"
        @click="emits('on-tab-change', id)"
        :class="id === activeTab ? 'bg-oranje' : 'bg-movie-black-200'"
        class="border-radius-8  rounded-lg px-4 py-2 text-white drop-shadow-sm hover:bg-oranje cursor-pointer">
            {{ emoji }}
            {{ title }}
        </a>
       </nav>
    </div>
</template>

<script lang="ts" setup>
import type { Tab } from '../types';

 defineProps<{
    tabs: Tab[];
    activeTab: string
 }>()

const emits = defineEmits<{
    'on-tab-change': [tab: string]
 }>()
</script>

<style scoped>

</style>