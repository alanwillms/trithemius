<template>
  <div>
    <label class="block text-sm font-bold text-gray-600 uppercase">{{
      label
    }}</label>

    <select
      class="w-full p-3 mt-2 text-gray-900 bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      ><slot
    /></select>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    modelValue: String,
  },
}
</script>
