<template>
  <div
    :class="{
      'p-4': true,
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
