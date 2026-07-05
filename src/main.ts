import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from './router'
import { checkBackendConnection } from './api/health.ts'

createApp(App).use(router).mount('#app')

checkBackendConnection()
console.log('%c🚀 Frontend started successfully', 'color: #f37515; font-weight: bold')
