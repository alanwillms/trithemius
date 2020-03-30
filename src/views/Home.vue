<template>
  <page-view title="Translations">
    <div class="flex w-full justify-end">
      <div class="w-full sm:w-auto">
        <page-button @click="newTranslation">
          New Translation
        </page-button>
      </div>
    </div>

    <page-card
      class="mt-4 cursor-pointer"
      v-for="(translation, key) in translations"
      v-bind:key="key"
      @click="editTranslation(translation)"
      >
      {{ translation }}
    </page-card>
  </page-view>
</template>

<script>
import PageButton from '@/components/PageButton'
import PageCard from '@/components/PageCard'
import PageView from '@/components/PageView'

export default {
  components: {
    PageButton,
    PageCard,
    PageView
  },
  setup () {
    const newTranslation = function () {
      window.location.href = '/translations/new'
    }

    const editTranslation = function (id) {
      // @fixme
      // this.$router.push({ name: 'edit_translation', params: { id } })
      window.location.href = `/translations/${id}`
    }

    return {
      editTranslation,
      newTranslation,
      translations: (JSON.parse(window.localStorage.getItem('projects') || '[]'))
    }
  }
}
</script>
