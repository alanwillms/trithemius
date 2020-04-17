import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import EditTranslation from '../views/EditTranslation.vue'
import NewTranslation from '../views/NewTranslation.vue'
import Settings from '../views/Settings.vue'
import SignIn from '../views/SignIn.vue'
import { getSetting } from '../helpers'
import { userStore } from '../store/user.store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/login',
    name: 'SignIn',
    component: SignIn
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

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const { loggedIn } = userStore.getState()
  if (to.name !== 'SignIn' && !loggedIn) {
    next({ name: 'SignIn' })
  }

  if (to.name !== 'Settings' && !getSetting('googleTranslateApiKey')) {
    next({ name: 'Settings' })
  }
  return next()
})

export { router, routerHistory }
