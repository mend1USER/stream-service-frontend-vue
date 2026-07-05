import { http } from './http'

export const checkBackendConnection = async() => {
try {
    const {data} = await http.get('/health')
    console.log('%c✅ Frontend ↔ Backend connected', 'color: #22c55e; font-weight: bold', data)
    return true
} catch (error) {
     console.error('%c❌ Backend connection failed', 'color: #ef4444; font-weight: bold', error)
    return false
}}