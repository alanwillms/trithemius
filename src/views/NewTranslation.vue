<template>
  <page-view title="New Translation" back-route="/">
    <div class="mb-8">
      <label class="block mb-2 text-sm leading-none uppercase text-blue-700 w-full">Project title</label>
      <input
        class="block w-full leading-none shadow-xl rounded bg-blue-900 h-12 p-4"
        type="text"
        :disabled="state.isLoading"
        v-model="state.title"
      >
    </div>

    <div class="mb-8">
      <label class="block mb-2 text-sm leading-none uppercase text-blue-700 w-full">Source text</label>
      <textarea
        class="block w-full leading-none shadow-xl rounded bg-blue-900 p-4"
        :disabled="state.isLoading"
        v-model="state.sourceText"
      ></textarea>
    </div>

    <!-- <form-field
      class="mb-8"
      label="Project title"
      :disabled="state.isLoading"
      v-model="state.title"
      />

    <form-field
      type="textarea"
      class="mb-8"
      label="Source text"
      :disabled="state.isLoading"
      v-model="state.sourceText" /> -->

    <p>
      <page-button
        @click="translateText"
        :disabled="state.isLoading">
        Translate
      </page-button>
    </p>
  </page-view>
</template>

<script>
// import FormField from '@/components/FormField'
import PageButton from '@/components/PageButton'
import PageView from '@/components/PageView'
import { reactive } from 'vue'
import { createTranslation, editTranslation } from '@/helpers'

const API_KEY = process.env.VUE_APP_GOOGLE_TRANSLATE_API_KEY

export default {
  components: {
    // FormField,
    PageButton,
    PageView
  },
  setup () {
    const state = reactive({
      isLoading: false,
      title: '',
      sourceLanguage: 'en',
      targetLanguage: 'pt',
      sourceText: '',
      translatedText: ''
    })

    const translateText = function () {
      const text = state.sourceText
      const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`

      const data = {
        q: text.split('\n\n'),
        source: state.sourceLanguage,
        target: state.targetLanguage
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

          const sourceParagraphs = text.split('\n\n')
          const automaticTranslationParagraphs = response.data.translations.map(item => item.translatedText)

          const paragraphs = []

          for (const key in sourceParagraphs) {
            paragraphs.push({
              key,
              source: sourceParagraphs[key],
              translation: automaticTranslationParagraphs[key],
              automaticTranslation: automaticTranslationParagraphs[key],
              touched: false
            })
          }

          const translation = createTranslation(state, paragraphs)

          editTranslation(translation)
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