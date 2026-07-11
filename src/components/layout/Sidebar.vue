<template>
    <nav
    class="block bg-movie-black-200"
    >
    <div class="relative flex flex-col w-30 p-10 space-y-3">
        <router-link v-for="{to, icon, activIcons} in menu"
        :to="to"
        :key="to"
        :class="[
           route.path === to ? 'bg-hover-black-400 text-white' : 'text-gray-600 :hover-w', 'rounded h-14 w-14 shrink-0 inline-flex items-center justify-center'
        ]"
        >
    <component :is="route.path === to ? activIcons : icon" class="h-6 w-6"/>
    </router-link>
    </div>
       
    </nav>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import {HomeIcon, FilmIcon, MagnifyingGlassIcon} from '@heroicons/vue/24/outline'
import {HomeIcon as HomeSolidIcon, FilmIcon as FilmSolidIcon, MagnifyingGlassIcon as MagnifyingGlassSolidIcon} from '@heroicons/vue/24/solid'

const route = useRoute()


  const menu = [
    {
        to: '/main', icon: HomeIcon, activIcons: HomeSolidIcon
    },
    {
       to: '/search', icon: MagnifyingGlassIcon, activIcons: MagnifyingGlassSolidIcon
   },
     {
        to: '/player', icon: FilmIcon, activIcons: FilmSolidIcon
    }
  ]
   
</script>

<style lang="scss" scoped>

</style>