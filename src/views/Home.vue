<template>
  <div class="container mx-auto my-4">
    <div class="flex w-full mb-4">
      <div class="w-1/2 p-2">
        <p class="text-lg font-bold mb-4">Source text:</p>
        <textarea rows="6" class="p-4 border rounded w-full" :disabled="state.isLoading" v-model="state.sourceText"></textarea>
      </div>

      <div class="w-1/2 p-2">
        <p class="text-lg font-bold mb-4">Translated text:</p>
        <textarea rows="6" class="p-4 border rounded w-full" disabled v-model="state.translatedText"></textarea>
      </div>
    </div>

    <p>
      <button class="border font-bold uppercase text-white py-2 px-4 rounded bg-blue-600 w-full" type="button" @click="translateText" :disabled="state.isLoading">
        Translate
      </button>
    </p>
  </div>
</template>

<script>
import { reactive } from 'vue'

const fromLang = 'en'
const toLang = 'pt'

const API_KEY = process.env.VUE_APP_GOOGLE_TRANSLATE_API_KEY

export default {
  setup () {
    const state = reactive({
      isLoading: false,
      sourceText: '',
      translatedText: ''
    })

    const translateText = function () {
      const text = state.sourceText
      const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`

      const data = {
        q: text.split('\n\n'),
        source: fromLang,
        target: toLang
      }

      state.isLoading = true

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      })
        .then(res => res.json())
        .then((response) => {
          state.isLoading = false
          state.translatedText = response.data.translations.map(item => item.translatedText).join('\n\n')
        })
        .catch(error => {
          state.isLoading = false
          console.log('There was an error with the translation request: ', error)
        })
    }

    return {
      state,
      translateText
    }
  }
}
</script>
