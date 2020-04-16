<template>
  <page-view title="Settings" back-route="/">
    <div class="mb-8">
      <label class="block mb-2 text-sm leading-none uppercase text-blue-700 w-full">
        Google Translate API Key
      </label>
      <input
        class="block w-full leading-none shadow-xl rounded bg-blue-900 h-12 p-4"
        type="text"
        :disabled="state.hasErrors"
        v-model="state.googleTranslateApiKey"
      >
    </div>

    <!-- <form-field
      class="mb-8"
      label="Google Translate API"
      :disabled="state.hasErrors"
      v-model="state.googleTranslateApiKey"
      /> -->

    <p>
      <page-button
        @click="save"
        :disabled="state.hasErrors">
        Save
      </page-button>
    </p>
  </page-view>
</template>

<script>
// import FormField from '@/components/FormField'
import PageButton from '@/components/PageButton'
import PageView from '@/components/PageView'
import { reactive } from 'vue'
import { defineSetting } from '@/helpers'

export default {
  components: {
    // FormField,
    PageButton,
    PageView
  },
  setup () {
    const state = reactive({
      hasErrors: false,
      googleTranslateApiKey: ''
    })

    const save = () => {
      defineSetting('googleTranslateApiKey', state.googleTranslateApiKey)
      // @fixme
      window.location.href = '/'
    }

    return {
      state,
      save
    }
  }
}
</script>
