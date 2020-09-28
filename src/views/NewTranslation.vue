<template>
  <page-view title="New Translation" back-route="/">
    <form-field
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
      v-model="state.sourceText" />

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
import FormField from '@/components/FormField'
import PageButton from '@/components/PageButton'
import PageView from '@/components/PageView'
import { reactive } from 'vue'
import { editTranslation } from '@/helpers'
import { storeTranslation } from '@/storage/cloud-firestore'
import { v4 as uuid } from 'uuid'
import { translate as machineTranslation } from '@/machine-translation/google-cloud'

export default {
  components: {
    FormField,
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
    })

    const translate = async () => {
      try {
        state.isLoading = true

        const sourceText = state.sourceText.replace(/\n{2,}/g, "\n\n")
        const automaticTranslation = await machineTranslation(
          state.targetLanguage,
          sourceText,
          state.sourceLanguage,
        )

        const sourceParagraphs = sourceText.split('\n\n')
        const automaticTranslationParagraphs = automaticTranslation.split('\n\n')

        const translation = {
          id: uuid(),
          title: state.title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          sourceLanguage: state.sourceLanguage,
          targetLanguage: state.targetLanguage,
          completeness: 0,
          paragraphs: [],
        }

        for (const key in sourceParagraphs) {
          translation.paragraphs.push({
            key,
            source: sourceParagraphs[key],
            translation: automaticTranslationParagraphs[key],
            automaticTranslation: automaticTranslationParagraphs[key],
            touched: false
          })
        }

        try {
          const record = await storeTranslation(translation)
          editTranslation(record)
        } catch(error) {
          console.log('There was an error while storing the project in the database: ', error)
          state.isLoading = false
        }
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
