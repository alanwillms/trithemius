<template>
  <page-view title="Login">
    <div class="mb-8">
      <label
        class="block w-full mb-2 text-sm leading-none text-blue-700 uppercase"
        >E-mail</label
      >
      <input
        class="block w-full h-12 p-4 leading-none bg-blue-900 rounded shadow-xl"
        type="email"
        :disabled="state.isLoading"
        v-model="state.email"
      />
    </div>

    <div v-if="state.error" class="mb-8 text-red-700">
      {{ state.error }}
    </div>

    <div class="mb-8">
      <label
        class="block w-full mb-2 text-sm leading-none text-blue-700 uppercase"
        >Password</label
      >
      <input
        class="block w-full h-12 p-4 leading-none bg-blue-900 rounded shadow-xl"
        type="password"
        :disabled="state.isLoading"
        v-model="state.password"
      />
    </div>

    <p>
      <page-button type="primary" @click="signIn()" :disabled="state.isLoading">
        Sign in
      </page-button>
    </p>
  </page-view>
</template>

<script lang="ts">
import PageButton from '@/components/PageButton.vue'
import PageView from '@/components/PageView'
import { reactive } from 'vue'
import firebase from 'firebase'
import { userStore } from '../store/user.store'

export default {
  components: {
    PageButton,
    PageView,
  },
  setup() {
    const state = reactive({
      isLoading: false,
      email: '',
      password: '',
      error: '',
    })

    const signIn = () => {
      state.isLoading = true
      firebase
        .auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .then(data => {
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
      signIn,
    }
  },
}
</script>
