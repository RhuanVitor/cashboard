import { createRouter, createWebHistory } from 'vue-router'

import NotFound from '../pages/NotFound.vue'
import HomePage from '../pages/HomePage.vue'

const routes = [
    { path: '/', component: HomePage},
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

export default createRouter({
    history: createWebHistory(),
    routes
})