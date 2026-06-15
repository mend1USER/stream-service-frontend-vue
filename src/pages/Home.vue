<template>
    <page>
       <template #title>Home</template>
       <div>
        <tabs :tabs="tabsMocks" active-tab="activeTabs" @on-tab-change="onTabChange"/>
       </div>
    </page>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import Tabs from '../components/Tabs.vue';
import Page from '../components/layout/Page.vue';
import {tabs as tabsMocks } from '../mocks/tabs.ts';


const activeTabs = ref<string>(tabsMocks[0].id)
    const onTabChange = (tabId: string) => {
         activeTabs.value = tabId
    }
    
</script>

<style lang="scss" scoped>

</style>