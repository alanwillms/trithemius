<template>
  <div>
    <header v-if="title" class="text-center leading-none text-lg font-bold p-4 border-b border-solid border-blue-900 uppercase">
      {{ title }}
    </header>

    <div class="p-4">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      required: false
    }
  },
  setup (props) {
    return props
  }
}
</script>
