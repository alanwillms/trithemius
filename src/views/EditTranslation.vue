<template>
  <page-view :title="pageTitle || 'Editing translation'" back-route="/">
    <template #buttons>
      <div class="w-full flex items-center">
        <div class="flex-shrink w-1/2 text-xl font-bold">
          {{ translation?.title || 'Loading...' }}
        </div>

        <div
          v-if="translation"
          class="flex items-center justify-end w-1/2 whitespace-no-wrap"
        >
          <page-button size="small" @click="downloadOriginal()">
            Download Original
          </page-button>

          <page-button class="ml-4" size="small" @click="downloadTranslation()">
            Download Translation
          </page-button>

          <div class="inline-block ml-4 text-sm">
            {{ translation?.wordCount || 0 }} words
          </div>

          <translation-progress
            class="ml-4"
            :key="translation?.completeness || 0"
            :completeness="translation?.completeness || 0"
          />
        </div>
      </div>
    </template>

    <div
      class="flex-grow flex-shrink-0"
      style="height: calc(100vh - 2rem - 3rem - 3rem - 1px)"
    >
      <div class="w-full h-full max-h-full">
        <div class="w-full h-full max-h-full overflow-y-scroll">
          <cat-paragraph
            v-for="(paragraph, key) in paragraphs"
            v-bind:key="key"
            :id="`paragraph-${key}`"
            :paragraph="paragraph"
            :is-selected="key === selectedParagraph"
            @select="selectParagraph(key, 'translated')"
            @cancel="cancelEditing()"
            @repeat="repeatOriginalEditing()"
            @save="saveEditing()"
          />
        </div>
      </div>
    </div>
  </page-view>
</template>

<script>
import CatParagraph from '@/components/CatParagraph'
import PageView from '@/components/PageView'
import PageButton from '@/components/PageButton'
import TranslationProgress from '@/components/TranslationProgress'
import { ref, reactive, computed } from 'vue'
import { calculateCompletenessPercentage } from '@/helpers'
import { findTranslation, storeTranslation } from '@/storage'
import { useStore } from 'vuex'
import { downloadAs, countWords } from '@/helpers/editor'

export default {
  components: {
    CatParagraph,
    PageView,
    PageButton,
    TranslationProgress,
  },
  setup() {
    const buildParagraph = paragraph => {
      return reactive(paragraph)
    }

    const store = useStore()
    const id = window.location.href
      .replace(/\/$/, '')
      .split('/')
      .pop()
    const translation = ref(null)
    const isLoading = ref(true)
    const pageTitle = ref(`Loading translation...`)
    const textBeingEdited = computed(() => store.state.textBeingEdited)
    const selectedParagraph = ref(null)
    const paragraphs = ref([])

    findTranslation(id)
      .then(record => {
        translation.value = record
        isLoading.value = false
        paragraphs.value = record.paragraphs.map(buildParagraph)
        pageTitle.value = `Editing Translation (${record.completeness.toFixed(
          0,
        )}%)`
        if (record.wordCount === null || record.wordCount === undefined) {
          record.wordCount = countWords(
            record.paragraphs.map(paragraph => paragraph.source).join(' '),
          )
        }
      })
      .catch(err => {
        isLoading.value = false
        pageTitle.value = `Translation not found`
        console.error(err)
      })

    const saveDocument = () => {
      translation.value.completeness = calculateCompletenessPercentage(
        translation.value.paragraphs,
      )
      translation.value.updatedAt = new Date().toISOString()
      pageTitle.value = `Editing Translation (${translation.value.completeness.toFixed(
        0,
      )}%)`
      storeTranslation(translation.value)
    }

    const downloadOriginal = () => {
      downloadAs(
        `${translation.value.title}-original.txt`,
        translation.value.paragraphs.map(item => item.source).join('\n\n'),
      )
    }

    const downloadTranslation = () => {
      downloadAs(
        `${translation.value.title}-translated.txt`,
        translation.value.paragraphs.map(item => item.translation).join('\n\n'),
      )
    }

    const selectParagraph = (key, side) => {
      // Re-selected same paragraph
      if (selectedParagraph.value === key) {
        return
      }

      // Selected another paragraph and didn't save the previous one
      if (
        selectedParagraph.value !== null &&
        textBeingEdited.value !== '' &&
        textBeingEdited.value !==
          paragraphs.value[selectedParagraph.value].translation
      ) {
        return
      }

      selectedParagraph.value = key

      store.dispatch(
        'setTextBeingEdited',
        paragraphs.value[key].translation
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'"),
      )
    }

    const cancelEditing = () => {
      selectedParagraph.value = null
    }

    const repeatOriginalEditing = () => {
      const key = selectedParagraph.value
      store.dispatch('setTextBeingEdited', paragraphs.value[key].source)
    }

    const saveEditing = () => {
      const key = selectedParagraph.value
      paragraphs.value[key].touched = true
      paragraphs.value[key].translation = textBeingEdited.value
      store.dispatch('setTextBeingEdited', '')
      cancelEditing()
      saveDocument()
    }

    return {
      translation,
      pageTitle,
      textBeingEdited,
      selectedParagraph,
      cancelEditing,
      selectParagraph,
      paragraphs,
      saveEditing,
      downloadOriginal,
      downloadTranslation,
      repeatOriginalEditing,
    }
  },
}
</script>
