<template>
  <div
    class="flex flex-col items-center justify-center gap-4"
    :class="fullHeight ? 'h-full min-w-0 flex-1' : ''"
  >
    <svg
      :width="sizeMap[size]"
      :height="sizeMap[size]"
      viewBox="0 0 100 100"
      class="reel-spin"
    >
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="var(--color-movie-black-300, #262c31)"
        stroke-width="6"
      />
      <circle
        v-for="n in 12"
        :key="n"
        :cx="50 + 44 * Math.cos((n * 30 * Math.PI) / 180)"
        :cy="50 + 44 * Math.sin((n * 30 * Math.PI) / 180)"
        r="3.2"
        fill="var(--color-movie-black-200, #0b0b0d)"
      />
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke="var(--color-oranje, #f37515)"
        stroke-width="6"
        stroke-linecap="round"
        stroke-dasharray="70 200"
      />
      <circle cx="50" cy="50" r="10" fill="var(--color-oranje, #f37515)" />
      <circle cx="50" cy="50" r="4" fill="var(--color-movie-black-200, #0b0b0d)" />
    </svg>

    <p v-if="label" class="text-sm text-gray-400 animate-pulse">{{ label }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        size?: 'sm' | 'md' | 'lg'
        label?: string
        fullHeight?: boolean
    }>(),
  {  
    size: 'md',
    label: '',
    fullHeight: false
})

const sizeMap = {
    sm: '40',
    md: '64',
    lg: '96'
}
</script>

<style scoped>
.reel-spin {
  animation: reel-rotate 1.1s linear infinite;
}

@keyframes reel-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reel-spin {
    animation: none;
  }
}
</style>