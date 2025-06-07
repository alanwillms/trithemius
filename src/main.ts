import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import { router } from './router'
import firebase from './firebase'
import { getAuth, onAuthStateChanged, User } from 'firebase/auth'
import { userStore } from './store/user.store'
import store from './store'

const app = createApp(App)

const auth = getAuth(firebase)
onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    return userStore.setUserData(user)
  }
  return userStore.clearUserData()
})

app.use(router)

app.use(store)

app.mount('#app')
