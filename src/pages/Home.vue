<template>
    <page paddingless>
       <template #title>Home</template>
       <div class="mx-4">
        <tabs  :tabs="tabsMocks" :active-tab="activeTabs" @on-tab-change="onTabChange"/>
     <content-row class="mx-4">
        <main-banner />
        <div class="ml-10 max-w-md w-full">
        <flash-news />
        </div>
    </content-row>
    </div>
    <content-row class="flex-col">
        <h1 class="mx-4 text-2xl text-white font-bold">Special For You</h1>
        <movie-feed />
    </content-row>
    </page>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import Tabs from '../components/Tabs.vue';
import Page from '../components/layout/Page.vue';
import {tabs as tabsMocks } from '../mocks/tabs.ts';
import MainBanner from '../components/MainBanner.vue';
import MovieFeed from '../components/MovieFeed.vue';
import FlashNews from '../components/FlashNews.vue';
import ContentRow from '../components/ContentRow.vue';


const activeTabs = ref<string>(tabsMocks[0].id)
    const onTabChange = (tabId: string) => {
         activeTabs.value = tabId
    }
    
</script>

<style lang="scss" scoped>

</style>