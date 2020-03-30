import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import EditTranslation from '../views/EditTranslation.vue'
import NewTranslation from '../views/NewTranslation.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/translations/new',
    name: 'new_translation',
    component: NewTranslation
  },
  {
    path: '/translations/:id',
    name: 'edit_translation',
    component: EditTranslation
  },
  { path: '/:data(.*)', component: NotFound, name: 'NotFound' }
]

export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  base: process.env.BASE_URL,
  routes
})
