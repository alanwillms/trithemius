<template>
  <div
    :class="{
      flex: true,
      'w-full': true,
      border: true,
      'text-gray-900': true,
      'font-serif': true,
      'border-b-0': true,
      'border-gray-400': true,
      'bg-gray-100': !isSelected,
      'bg-gray-400': isSelected,
    }"
  >
    <div class="w-1/2 h-full">
      <cat-source-paragraph
        :id="`source-text-${paragraph.key}`"
        :paragraph="paragraph"
        :is-selected="isSelected"
        @click="$emit('select')"
      />
    </div>

    <div class="w-1/2 h-full">
      <cat-translated-paragraph
        :id="`translated-text-${paragraph.key}`"
        :paragraph="paragraph"
        :is-editable="isSelected"
        @select="$emit('select')"
        @cancel="$emit('cancel')"
        @repeat="$emit('repeat')"
        @save="$emit('save')"
      />
    </div>
  </div>
</template>

<script>
import CatSourceParagraph from '@/components/CatSourceParagraph'
import CatTranslatedParagraph from '@/components/CatTranslatedParagraph'

export default {
  components: {
    CatSourceParagraph,
    CatTranslatedParagraph,
  },
  props: {
    paragraph: {
      type: Object,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    modelValue: String,
  },
}
</script>
