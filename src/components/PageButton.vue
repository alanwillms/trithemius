<template>
  <button class="font-bold uppercase text-white leading-none p-4 rounded-lg bg-blue-500 w-full hover:bg-blue-600 active:bg-blue-600" type="button" :disabled="disabled">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  setup () {

  }
}
</script>
