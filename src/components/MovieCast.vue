<template>
  <div class="mx-auto max-w-6xl px-4 pb-12">
    <h2 class="mb-4 text-xl font-semibold text-white">В ролях</h2>
    <div class="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
      <div v-for="actor in actors" :key="actor.name" class="flex flex-col gap-2">
        <div class="aspect-square w-full overflow-hidden rounded-full bg-movie-black-300">
          <img
            v-if="actor.photo"
            :src="actor.photo"
            :alt="actor.name"
            class="h-full w-full object-cover"
          />
          <div v-else class="flex h-full w-full items-center justify-center text-xs text-gray-600">
            {{ getInitials(actor.name) }}
          </div>
        </div>
        <div class="text-center">
          <p class="line-clamp-1 text-xs font-medium text-white">{{ actor.name }}</p>
          <p v-if="actor.character" class="line-clamp-1 text-xs text-gray-500">{{ actor.character }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CastMember } from '../mocks/movies.ts'

defineProps<{
  actors: CastMember[]
}>()

const getInitials = (name?: string) => {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>