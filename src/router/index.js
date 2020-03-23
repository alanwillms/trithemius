import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import EditTranslation from '../views/EditTranslation.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/translations/:id',
    name: 'Edit Translations',
    component: EditTranslation
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  { path: '/:data(.*)', component: NotFound, name: 'NotFound' }
]

export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  base: process.env.BASE_URL,
  routes
})
