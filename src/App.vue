<template>
  <div class="hello">
    <p>Source text:</p>
    <p>
      <textarea rows="3" :disabled="state.isLoading" v-model="state.sourceText"></textarea>
    </p>
    <p>
      <textarea rows="3" disabled v-model="state.translatedText"></textarea>
    </p>
    <p>
      <button type="button" @click="translateText" :disabled="state.isLoading">
        Translate
      </button>
    </p>
  </div>
</template>

<script>
import { reactive } from 'vue'

const fromLang = 'en'
const toLang = 'pt' // translate to norwegian

const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY

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
