<template>
  <div>
    <label class="block text-sm font-bold text-gray-600 uppercase">{{
      label
    }}</label>
    <input
      v-if="type !== 'textarea'"
      class="w-full p-3 mt-2 text-gray-900 bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
      :type="type"
      :disabled="disabled"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />

    <textarea
      v-if="type === 'textarea'"
      class="w-full p-3 mt-2 text-gray-900 bg-gray-300 rounded-lg focus:outline-none focus:shadow-outline"
      :disabled="disabled"
      :rows="rows"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
      default: 'text',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    rows: {
      type: Number,
      required: false,
      default: 5,
    },
    modelValue: String,
  },
}
</script>
