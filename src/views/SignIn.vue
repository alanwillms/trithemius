<template>
  <page-view title="Login">
    <div class="mb-8">
      <label class="block mb-2 text-sm leading-none uppercase text-blue-700 w-full">E-mail</label>
      <input
        class="block w-full leading-none shadow-xl rounded bg-blue-900 h-12 p-4"
        type="email"
        :disabled="state.isLoading"
        v-model="state.email"
      >
    </div>

    <div v-if="state.error" class="mb-8 text-red-700">
      {{ state.error }}
    </div>

    <div class="mb-8">
      <label class="block mb-2 text-sm leading-none uppercase text-blue-700 w-full">Password</label>
      <input
        class="block w-full leading-none shadow-xl rounded bg-blue-900 h-12 p-4"
        type="password"
        :disabled="state.isLoading"
        v-model="state.password"
      >
    </div>

    <p>
      <page-button
        type="primary"
        @click="signIn()"
        :disabled="state.isLoading">
        Sign in
      </page-button>
    </p>
  </page-view>
</template>

<script type="typescript">
import PageButton from '@/components/PageButton'
import PageView from '@/components/PageView'
import { reactive } from 'vue'
import * as firebase from 'firebase'
import { userStore } from '../store/user.store'

export default {
  components: {
    PageButton,
    PageView
  },
  setup () {
    const state = reactive({
      isLoading: false,
      email: '',
      password: '',
      error: ''
    })

    const signIn = () => {
      state.isLoading = true
      firebase
        .auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .then(data => {
          // this.$router.replace({ name: "Dashboard" });
          userStore.setUserData(data)
          state.isLoading = false
          window.location.href = '/'
        })
        .catch(err => {
          state.isLoading = false
          state.error = err.message
          console.log(err)
        })
    }

    return {
      state,
      signIn
    }
  }
}
</script>
