<template>
  <page-view title="Translations">
    <div class="flex w-full justify-end">
      <div class="w-full sm:w-auto">
        <page-button type="primary" @click="newTranslation">
          New Translation
        </page-button>
      </div>
    </div>

    <page-card
      class="mt-4"
      v-if="isLoading"
      >
      Loading translations...
    </page-card>

    <page-card
      class="mt-4"
      v-if="!isLoading && (!translations || translations.length === 0)"
      >
      No translation projects found.
    </page-card>

    <page-card
      class="mt-4 cursor-pointer flex items-center"
      v-for="(translation, key) in translations"
      v-bind:key="key"
      >
      <div class="flex-grow" @click="editTranslation(translation)">
        {{ translation.title || translation.id }}
        ({{ (translation.completeness || 0).toFixed(0) }}%)
      </div>

      <div class="flex-grow-0 pl-2" @click="editTranslation(translation)">
        <page-button>
          Edit
        </page-button>
      </div>

      <div class="flex-grow-0 pl-2" @click="confirmAndDeleteTranslation(translation)">
        <page-button type="danger">
          Delete
        </page-button>
      </div>
    </page-card>
  </page-view>
</template>

<script>
import PageButton from '@/components/PageButton'
import PageCard from '@/components/PageCard'
import PageView from '@/components/PageView'
import { editTranslation, deleteTranslation } from '@/helpers'
import { listTranslations } from '@/storage/cloud-firestore'
import { ref } from 'vue'

export default {
  components: {
    PageButton,
    PageCard,
    PageView
  },
  setup () {
    const newTranslation = function () {
      // @fixme use vue router
      window.location.href = '/translations/new'
    }

    const translations = ref([])
    const isLoading = ref(true)

    listTranslations().then(rows => {
      translations.value = rows
      isLoading.value = false
    })

    // const translations = (JSON.parse(window.localStorage.getItem('translations') || '[]'))

    // translations.forEach(project => {
    //   if (project.completeness < 100) {
    //     const translationProject = getTranslation(project.id)
    //     translationProject.owner = 'i1GhHPoFjLb46gL40wZxrp9Mh923'
    //     // storeTranslation(translationProject)
    //   }
    // })

    const confirmAndDeleteTranslation = (translation) => {
      if (confirm('Are you sure?')) {
        deleteTranslation(translation)
      }
    }

    return {
      confirmAndDeleteTranslation,
      editTranslation,
      newTranslation,
      translations,
      isLoading
    }
  }
}
</script>
