import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'
import EditTranslation from '../views/EditTranslation.vue'
import NewTranslation from '../views/NewTranslation.vue'
import SignIn from '../views/SignIn.vue'
import { userStore } from '../store/user.store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'SignIn',
    component: SignIn,
  },
  {
    path: '/translations/new',
    name: 'new_translation',
    component: NewTranslation,
  },
  {
    path: '/translations/:id',
    name: 'edit_translation',
    component: EditTranslation,
  },
  { path: '/:data(.*)', component: NotFound, name: 'NotFound' },
]

const routerHistory = createWebHistory()

const router = createRouter({
  history: routerHistory,
  routes,
})

router.beforeEach((to, _from, next) => {
  if (import.meta.env.VITE_STORAGE_DRIVER === 'firebase') {
    const { loggedIn } = userStore.getState()
    if (to.name !== 'SignIn' && !loggedIn) {
      return next({ name: 'SignIn' })
    }
  }

  return next()
})

export { router, routerHistory }
