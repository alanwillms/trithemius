import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
import { router } from './router'
import firebase from './firebase'
import { userStore } from './store/user.store'

const app = createApp(App)

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    return userStore.setUserData(user)
  }
  return userStore.clearUserData()
})

app.use(router)

app.mount('#app')
