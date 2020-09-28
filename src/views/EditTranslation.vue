<template>
  <page-view
    :title="pageTitle || 'Editing translation'"
    back-route="/"
    action-text="Download"
    :action-callback="downloadTranslation"
    >
    <div class="flex-grow flex-shrink-0" style="height: calc(100vh - 2rem - 3rem - 1px)">
      <div class="flex w-full h-full max-h-full bg-white text-black">
        <div class="w-1/2 h-full max-h-full overflow-y-scroll">
          <cat-source-paragraph
            v-for="(paragraph, key) in paragraphs"
            v-bind:key="key"
            :id="`source-text-${key}`"
            :paragraph="paragraph"
            :is-selected="key === selectedParagraph"
            @click="selectParagraph(key, 'source')" />
        </div>

        <div class="w-1/2 h-full max-h-full overflow-y-scroll">
          <cat-translated-paragraph
            v-for="(paragraph, key) in paragraphs"
            v-bind:key="key"
            v-model="textBeingEdited"
            :id="`translated-text-${key}`"
            :paragraph="paragraph"
            :is-editable="key === selectedParagraph"
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
import CatSourceParagraph from '@/components/CatSourceParagraph'
import CatTranslatedParagraph from '@/components/CatTranslatedParagraph'
import PageView from '@/components/PageView'
import { ref, reactive } from 'vue'
import { calculateCompletenessPercentage } from '@/helpers'
import { findTranslation, storeTranslation } from '@/storage/cloud-firestore'
import { saveAs } from 'file-saver'

export default {
  components: {
    CatSourceParagraph,
    CatTranslatedParagraph,
    PageView,
  },
  setup () {
    const buildParagraph = (paragraph) => {
      return reactive(paragraph)
    }

    const id = window.location.href.replace(/\/$/, '').split('/').pop()
    const translation = ref(null)
    const isLoading = ref(true)
    const pageTitle = ref(`Loading translation...`)
    const textBeingEdited = ref('')
    const selectedParagraph = ref(null)
    const paragraphs = ref([])

    findTranslation(id).then(record => {
      translation.value = record
      isLoading.value = false
      paragraphs.value = record.paragraphs.map(buildParagraph)
      pageTitle.value = `Editing Translation (${record.completeness.toFixed(0)}%)`
    }).catch(err => {
      isLoading.value = false
      pageTitle.value = `Translation not found`
      console.error(err)
    })

    const saveDocument = () => {
      translation.value.completeness = calculateCompletenessPercentage(translation.value.paragraphs)
      translation.value.updatedAt = new Date().toISOString()
      pageTitle.value = `Editing Translation (${translation.value.completeness.toFixed(0)}%)`
      storeTranslation(translation.value)
    }

    const downloadTranslation = () => {
      const content = translation.value.paragraphs.map(item => item.translation).join('\n\n')
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${translation.value.title}.txt`)
    }

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

      textBeingEdited.value = paragraphs.value[key].translation.replace(/&quot;/g, '"').replace(/&#39;/g, "'")

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
      downloadTranslation,
      repeatOriginalEditing
    }
  }
}
</script>
