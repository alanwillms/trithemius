<template>
  <div
    :class="{
      'p-4': true,
      border: true,
      'font-serif': true,
      'bg-yellow-400': isSelected,
      'border-transparent': !isSelected,
      'border-red-700': isSelected
    }">
    <div v-for="(line, lineKey) in paragraph.source.split('\n')" v-bind:key="lineKey">{{ line }}</div>
  </div>
</template>

<script>
export default {
  props: {
    paragraph: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  }
}
</script>
