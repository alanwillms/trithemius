<template>
  <page-view title="Translations">
    <div class="flex w-full justify-between">
      <div class="w-full sm:w-auto">
        <page-button type="danger" @click="signOut">
          Sign out
        </page-button>
      </div>

      <div class="w-full sm:w-auto">
        <page-button type="primary" @click="newTranslation">
          New Translation
        </page-button>
      </div>
    </div>

    <page-card class="mt-4" v-if="isLoading">
      Loading translations...
    </page-card>

    <page-card
      class="mt-4"
      v-if="!isLoading && (!translations || translations.length === 0)"
    >
      No translation projects found.
    </page-card>

    <div
      v-if="translations && translations.length > 0"
      class="mt-4 inline-block min-w-full shadow border border-gray-300 rounded-lg overflow-hidden"
    >
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Project
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              From
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              To
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Progress
            </th>
            <th
              class="w-56 text-center px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(translation, key) in translations" v-bind:key="key">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ translation.title || translation.id }}
              </p>
            </td>

            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ formatDate(translation.createdAt) }}
              </p>
            </td>

            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ translation.sourceLanguage }}
              </p>
            </td>

            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ translation.targetLanguage }}
              </p>
            </td>

            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <translation-progress
                :completeness="translation.completeness || 0"
              />
            </td>

            <td
              class="w-56 px-5 py-5 border-b border-gray-200 bg-white text-sm text-right"
            >
              <div class="flex justify-center">
                <div class="pr-2" @click="editTranslation(translation)">
                  <page-button title="Edit">
                    <i class="fas fa-edit"></i>
                  </page-button>
                </div>

                <div
                  class="pl-2"
                  @click="confirmAndDeleteTranslation(translation)"
                >
                  <page-button type="danger" title="Destroy">
                    <i class="fas fa-trash-alt"></i>
                  </page-button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </page-view>
</template>

<script>
import PageButton from '@/components/PageButton'
import PageCard from '@/components/PageCard'
import PageView from '@/components/PageView'
import TranslationProgress from '@/components/TranslationProgress'
import { editTranslation } from '@/helpers'
import { listTranslations, storeTranslation } from '@/storage'
import { ref } from 'vue'
import firebase from '../firebase'

export default {
  components: {
    PageButton,
    PageCard,
    PageView,
    TranslationProgress,
  },
  setup() {
    const newTranslation = function() {
      // @fixme use vue router
      window.location.href = '/translations/new'
    }

    const signOut = () => {
      firebase
        .auth()
        .signOut()
        .then(function() {
          // @fixme use vue router
          window.location.href = '/login'
        })
    }

    const translations = ref([])
    const isLoading = ref(true)

    listTranslations({ order: { by: 'createdAt', direction: 'desc' } }).then(
      rows => {
        translations.value = rows
        isLoading.value = false
      },
    )

    const formatDate = dateString => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    }

    const confirmAndDeleteTranslation = translation => {
      if (confirm('Are you sure?')) {
        translation.deletedAt = new Date().toISOString()
        storeTranslation(translation)
        const list = translations.value
        list.splice(
          list.findIndex(item => item.id === translation.id),
          1,
        )
        translation.value = list
      }
    }

    return {
      confirmAndDeleteTranslation,
      editTranslation,
      newTranslation,
      translations,
      isLoading,
      signOut,
      formatDate,
    }
  },
}
</script>
