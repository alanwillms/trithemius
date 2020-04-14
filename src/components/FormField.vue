<template>
  <div>
    <label class="block mb-2 text-sm leading-none uppercase text-blue-700 w-full">{{ label }}</label>
    <input
      v-if="type !== 'textarea'"
      class="block w-full leading-none shadow-xl rounded bg-blue-900 h-12 p-4"
      :type="type"
      :disabled="disabled"
      :value="value"
      @input="$emit('update', $event.target.value)"
    >

    <textarea
      v-if="type === 'textarea'"
      class="block w-full leading-none shadow-xl rounded bg-blue-900 p-4"
      :disabled="disabled"
      :rows="rows"
      :value="value"
      @input="$emit('update', $event.target.value)"
    ></textarea>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'value',
    event: 'update'
  },
  props: {
    label: {
      type: String,
      required: false
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    rows: {
      type: Number,
      required: false,
      default: 5
    },
    value: {
      required: false,
      default: ''
    }
  },
  setup () {
    return {
    }
  }
}
</script>
