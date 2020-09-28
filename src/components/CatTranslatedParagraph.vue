<template>
  <div>
    <div v-if="isEditable">
      <textarea
        :class="{
          'p-4': true,
          border: true,
          'font-mono': true,
          'border-transparent': !isEditable,
          'border-red-700': isEditable,
          'w-full': true
        }"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        autofocus>
      </textarea>

      <div class="mt-2 flex w-full justify-end">
        <button @click="$emit('repeat')" type="button" class="mx-2 rounded bg-orange-600 text-white py-2 px-4">
          Repeat
        </button>

        <button @click="$emit('cancel')" type="button" class="mx-2 rounded bg-red-600 text-white py-2 px-4">
          Cancel
        </button>

        <button @click="$emit('save')" type="button" class="mx-2 rounded bg-blue-600 text-white py-2 px-4">
          Save
        </button>
      </div>
    </div>

    <div
      v-else
      :class="{
        'p-4': true,
        border: true,
        'text-red-800': !paragraph.touched,
        'font-serif': true,
        'border-transparent': true,
      }"
      @click="$emit('select')">
      <div v-for="(line, lineKey) in paragraph.translation.split('\n')" v-bind:key="lineKey">{{ line }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    paragraph: {
      type: Object,
      required: true,
    },
    isEditable: {
      type: Boolean,
      default: false
    },
    modelValue: String,
  }
}
</script>
