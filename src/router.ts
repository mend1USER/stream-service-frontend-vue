import { createWebHistory, createRouter } from "vue-router";


export const router = createRouter({
    history: createWebHistory(),
    routes: [{
        name: 'home',
        path: '/main',
        component: () => import('./pages/Home.vue')
    },
        {
            name: 'search',
            path: '/search',
            component: () => import('./pages/Search.vue')
        },
        {
            name: 'MoviePlayer',
            path: '/player',
            component: () => import('./pages/Movie.vue')
        },
        {
            name: 'movie',
            path: '/movies/:id',
            component: () => import('./pages/MovieDetails.vue'),
            props: true
        }]
})