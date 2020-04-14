<template>
  <page-view title="New Translation" back-route="/">
    <form-field
      class="mb-8"
      label="Project title"
      :disabled="state.isLoading"
      v-model="state.title" />

    <form-field
      type="textarea"
      class="mb-8"
      label="Source text"
      :disabled="state.isLoading"
      v-model="state.sourceText" />

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
import FormField from '@/components/FormField'
import PageButton from '@/components/PageButton'
import PageView from '@/components/PageView'
import { reactive } from 'vue'

const fromLang = 'en'
const toLang = 'pt'

const API_KEY = process.env.VUE_APP_GOOGLE_TRANSLATE_API_KEY

const uuidv4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

const storeTranslationProject = (sourceText, translatedText) => {
  const projects = JSON.parse(window.localStorage.getItem('projects') || '[]')
  const projectId = uuidv4()
  projects.push(projectId)
  window.localStorage.setItem('projects', JSON.stringify(projects))
  window.localStorage.setItem(`project-${projectId}`, JSON.stringify({
    id: projectId,
    createdAt: new Date(),
    sourceText,
    translatedText
  }))

  return projectId
}

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
      translatedText: ''
    })

    const translateText = function () {
      const text = state.sourceText
      // const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`
      const url = `127.0.0.1?key=${API_KEY}`

      const data = {
        q: text.split('\n\n'),
        source: fromLang,
        target: toLang
      }

      console.log(state)

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

          const id = storeTranslationProject(
            state.sourceText,
            state.translatedText
          )

          // @fixme
          // this.$router.push({ name: 'edit_translation', params: { id } })
          window.location.href = `/translations/${id}`
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
