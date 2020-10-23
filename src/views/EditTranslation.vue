<template>
  <page-view
    :title="pageTitle || 'Editing translation'"
    back-route="/"
    action-text="Download"
    :action-callback="downloadTranslation"
  >
    <div
      class="flex-grow flex-shrink-0"
      style="height: calc(100vh - 2rem - 3rem - 1px)"
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
import { ref, reactive, computed } from 'vue'
import { calculateCompletenessPercentage } from '@/helpers'
import { findTranslation, storeTranslation } from '@/storage'
import { saveAs } from 'file-saver'
import { useStore } from 'vuex'

export default {
  components: {
    CatParagraph,
    PageView,
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

    const downloadTranslation = () => {
      const content = translation.value.paragraphs
        .map(item => item.translation)
        .join('\n\n')
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${translation.value.title}.txt`)
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
      pageTitle,
      textBeingEdited,
      selectedParagraph,
      cancelEditing,
      selectParagraph,
      paragraphs,
      saveEditing,
      downloadTranslation,
      repeatOriginalEditing,
    }
  },
}
</script>
