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
        type="primary"
        @click="translate"
        :disabled="state.isLoading">
        Translate
      </page-button>
    </p>
  </page-view>
</template>

<script>
// import FormField from '@/components/FormField'
import chunk from 'lodash.chunk'
import PageButton from '@/components/PageButton'
import PageView from '@/components/PageView'
import { reactive } from 'vue'
import { editTranslation } from '@/helpers'
import { storeTranslation } from '@/storage/cloud-firestore'
import { v4 as uuid } from 'uuid'
import firebase from '@/firebase'

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

    const sleep = (millis) => {
      return new Promise(resolve => setTimeout(resolve, millis))
    }

    const translate = async () => {
      try {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
        const sourceParagraphs = state.sourceText.split('\n\n')
        const chunks = chunk(sourceParagraphs, 128)
        let automaticTranslationParagraphs = []

        state.isLoading = true

        for (const key in chunks) {
          const chunk = chunks[key]
          const data = {
            q: chunk,
            source: state.sourceLanguage,
            target: state.targetLanguage
          }
          if (key > 0) {
            await sleep(60000)
          }
          const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          })

          const jsonData = await response.json()

          const responseTranslations = jsonData.data.translations.map(item => item.translatedText)

          automaticTranslationParagraphs = [
            ...automaticTranslationParagraphs,
            ...responseTranslations
          ]
        }

        state.isLoading = false
        state.translatedText = automaticTranslationParagraphs.join('\n\n')

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

        const translation = {
          id: uuid(),
          title: state.title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sourceLanguage: state.sourceLanguage,
          targetLanguage: state.targetLanguage,
          completeness: 0,
          paragraphs,
          owner: firebase.auth().currentUser.uid
        }

        storeTranslation(translation)
          .then(record => {
            editTranslation(record)
          })
          .catch(error => {
            console.log('There was an error with the translation request: ', error)
            state.isLoading = false
          })
      } catch (error) {
        state.isLoading = false
        console.log('There was an error with the translation request: ', error)
      }
    }

    return {
      state,
      translate
    }
  }
}
</script>
