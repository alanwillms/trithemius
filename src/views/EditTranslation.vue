<template>
  <page-view :title="pageTitle || 'Editing translation'" back-route="/">
    <div class="flex-grow flex-shrink-0" style="height: calc(100vh - 2rem - 3.125rem - 1px)">
      <div class="flex w-full h-full max-h-full bg-white text-black">
        <div class="w-1/2 h-full max-h-full overflow-y-scroll">
          <div
            :class="{
              'p-4': true,
              border: true,
              'font-serif': true,
              'bg-yellow-400': key === selectedParagraph,
              'border-transparent': key !== selectedParagraph,
              'border-red-700': key === selectedParagraph
            }"
            v-for="(paragraph, key) in paragraphs"
            v-bind:key="key"
            :id="`source-text-${key}`"
            @click="selectParagraph(key, 'source')">
            <div v-for="(line, lineKey) in paragraph.source.split('\n')" v-bind:key="lineKey">{{ line }}</div>
          </div>
        </div>

        <div class="w-1/2 h-full max-h-full overflow-y-scroll">
          <div
            v-for="(paragraph, key) in paragraphs"
            v-bind:key="key"
            :id="`translated-text-${key}`"
            @click="selectParagraph(key, 'translated')">
            <div
              v-if="key !== selectedParagraph"
              :class="{
                'p-4': true,
                border: true,
                'font-serif': true,
                'text-red-800': !paragraph.touched,
                'border-transparent': key !== selectedParagraph,
                'border-red-700': key === selectedParagraph
              }">
              <div v-for="(line, lineKey) in paragraph.translation.split('\n')" v-bind:key="lineKey">{{ line }}</div>
            </div>

            <div v-else>
              <textarea
                :class="{
                  'p-4': true,
                  border: true,
                  'font-mono': true,
                  // 'text-red-800': !paragraph.touched,
                  'border-transparent': key !== selectedParagraph,
                  'border-red-700': key === selectedParagraph,
                  'w-full': true
                }"
                v-model="textBeingEdited"
                autofocus>
              </textarea>

              <div class="mt-2 flex w-full justify-end">
                <button @click="repeatOriginalEditing()" type="button" class="mx-2 rounded bg-orange-600 text-white py-2 px-4">
                  Repeat
                </button>

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
  </page-view>
</template>

<script>
import PageView from '@/components/PageView'
import { ref, reactive } from 'vue'
import { getTranslation, updateTranslation, calculateCompletenessPercentage } from '@/helpers'

export default {
  components: {
    PageView
  },
  setup () {
    const buildParagraph = (paragraph) => {
      return reactive(paragraph)
    }

    const id = window.location.href.replace(/\/$/, '').split('/').pop()
    let translation = getTranslation(id)

    const saveDocument = () => {
      translation.completeness = calculateCompletenessPercentage(translation.paragraphs)
      pageTitle.value = `Editing Translation (${translation.completeness.toFixed(0)}%)`
      updateTranslation(translation)
    }

    if (!translation.paragraphs || translation.paragraphs.length === 0) {
      translation = {
        sourceText: 'Translation not found!',
        translatedText: 'Tradução não encontrada!'
      }
    }

    const pageTitle = ref(`Editing Translation (${translation.completeness.toFixed(0)}%)`)
    const textBeingEdited = ref('')
    const selectedParagraph = ref(null)
    const paragraphs = ref(translation.paragraphs.map(buildParagraph))

    const selectParagraph = (key, side) => {
      // Re-selected same paragraph
      if (selectedParagraph.value === key) {
        return
      }

      // Selected another paragraph and didn't save the previous one
      if (selectedParagraph.value !== null && textBeingEdited.value !== '' && textBeingEdited.value !== paragraphs.value[selectedParagraph.value].translation) {
        return
      }

      selectedParagraph.value = key

      textBeingEdited.value = paragraphs.value[key].translation

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

    const repeatOriginalEditing = () => {
      const key = selectedParagraph.value
      textBeingEdited.value = paragraphs.value[key].source
    }

    const saveEditing = () => {
      const key = selectedParagraph.value
      paragraphs.value[key].touched = true
      paragraphs.value[key].translation = textBeingEdited.value
      textBeingEdited.value = ''
      cancelEditing()
      saveDocument()
    }

    return {
      pageTitle,
      textBeingEdited,
      selectedParagraph,
      cancelEditing,
      selectParagraph,
      paragraphs,
      saveEditing,
      repeatOriginalEditing
    }
  }
}
</script>
