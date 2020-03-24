<template>
  <div class="flex h-full max-h-full v-full flex-col">
    <h1 class="flex-shrink flex-grow-0" style="height: 50px">Editing translation</h1>

    <div class="flex-grow flex-shrink-0" style="height: calc(100vh - 50px)">
      <div class="flex w-full h-full max-h-full">
        <div class="w-1/2 h-full max-h-full overflow-scroll">
          <div
            :class="{
              'p-4': true,
              border: true,
              'font-serif': true,
              'bg-yellow-400': key === selectedParagraph,
              'border-transparent': key !== selectedParagraph,
              'border-red-700': key === selectedParagraph
            }"
            v-for="(paragraph, key) in sourceText"
            v-bind:key="key"
            :id="`source-text-${key}`"
            @click="selectParagraph(key, 'source')">
            {{ paragraph.text }}
          </div>
        </div>

        <div class="w-1/2 h-full max-h-full overflow-scroll">
          <div
            v-for="(paragraph, key) in translatedText"
            v-bind:key="key"
            :id="`translated-text-${key}`"
            @click="selectParagraph(key, 'translated')">
            <div
              v-if="key !== selectedParagraph"
              :class="{
                'p-4': true,
                border: true,
                'font-serif': true,
                'text-red-800': !paragraph.revised,
                'border-transparent': key !== selectedParagraph,
                'border-red-700': key === selectedParagraph
              }">
              {{ paragraph.text }}
            </div>

            <div v-else>
              <textarea
                :class="{
                  'p-4': true,
                  border: true,
                  'font-mono': true,
                  // 'text-red-800': !paragraph.revised,
                  'border-transparent': key !== selectedParagraph,
                  'border-red-700': key === selectedParagraph,
                  'w-full': true
                }"
                v-model="textBeingEdited"
                autofocus>
              </textarea>

              <div class="mt-2 flex w-full justify-end">
                <button @click="cancelEditing()" type="button" class="mx-2 rounded bg-red-600 text-white py-2 px-4">
                  Cancel
                </button>

                <button @click="saveEditing()" type="button" class="mx-2 rounded bg-blue-600 text-white py-2 px-4">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
// import { sourceText as sourceTextRaw, translatedText as translatedTextRaw } from '@/dummy'

export default {
  setup () {
    const buildParagraph = (text) => {
      return reactive({
        text,
        revised: false
      })
    }

    const projectId = window.location.href.replace(/\/$/, '').split('/').pop()
    let project = JSON.parse(window.localStorage.getItem(`project-${projectId}`) || '{}')

    if (!project.sourceText || !project.translatedText) {
      project = {
        sourceText: 'Project not found!',
        translatedText: 'Projeto não encontrado!'
      }
    }

    const textBeingEdited = ref('')
    const selectedParagraph = ref(null)
    const sourceText = ref(project.sourceText.split('\n\n').map(buildParagraph))
    const translatedText = ref(project.translatedText.split('\n\n').map(buildParagraph))

    const selectParagraph = (key, side) => {
      // Re-selected same paragraph
      if (selectedParagraph.value === key) {
        return
      }

      // Selected another paragraph and didn't save the previous one
      if (selectedParagraph.value !== null && textBeingEdited.value !== '' && textBeingEdited.value !== translatedText.value[selectedParagraph.value].text) {
        return
      }

      selectedParagraph.value = key

      textBeingEdited.value = translatedText.value[key].text

      // const scrollOptions = { behavior: 'smooth' }
      const scrollOptions = {}

      if (key === null) {
        return
      }

      if (side === 'source') {
        document.getElementById(`translated-text-${key}`).scrollIntoView(scrollOptions)
      } else {
        document.getElementById(`source-text-${key}`).scrollIntoView(scrollOptions)
      }
    }

    const cancelEditing = () => {
      selectedParagraph.value = null
    }

    const saveEditing = () => {
      const key = selectedParagraph.value
      translatedText.value[key].revised = true
      translatedText.value[key].text = textBeingEdited.value
      textBeingEdited.value = ''
      cancelEditing()
    }

    return {
      textBeingEdited,
      selectedParagraph,
      cancelEditing,
      selectParagraph,
      sourceText,
      translatedText,
      saveEditing
    }
  }
}
</script>
