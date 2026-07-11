<!-- components/FactRow.vue -->
<template>
  <div class="flex items-baseline justify-between gap-4 border-b border-white/5 py-3 last:border-b-0">
    <p class="shrink-0 text-xs uppercase tracking-wide text-gray-500">{{ label }}</p>
    <p class="text-right text-sm text-white">{{ value }}</p>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  label: string
  value: string
}>()
</script>