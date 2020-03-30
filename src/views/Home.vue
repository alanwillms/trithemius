<template>
  <div class="container mx-auto my-4">
    <p>
      <button class="border font-bold uppercase text-white py-2 px-4 rounded bg-blue-600 w-full" type="button" @click="newTranslation">
        New Translation
      </button>
    </p>

    <div
      class="mt-4 border rounded p-4 cursor-pointer hover:text-blue-500"
      v-for="(translation, key) in translations"
      v-bind:key="key"
      @click="editTranslation(translation)"
      >
      {{ translation }}
    </div>
  </div>
</template>

<script>
export default {
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
