<template>
  <div>
    <header v-if="title" class="flex items-center w-full text-center leading-none text-lg font-bold px-4 h-12 border-b border-solid border-blue-900 uppercase">
      <div v-if="backRoute" class="flex-grow-0">
        <a :href="backRoute" class="text-white">
          ⮜
        </a>
      </div>

      <div class="flex-grow">{{ title }}</div>

      <div v-if="actionCallback" class="flex-grow-0">
        <page-button size="small" @click="actionCallback()">
          {{ actionText }}
        </page-button>
      </div>
    </header>

    <div class="p-4">
      <slot />
    </div>
  </div>
</template>

<script>
import PageButton from '@/components/PageButton'

export default {
  components: {
    PageButton
  },
  props: {
    title: {
      type: String,
      required: false
    },
    backRoute: {
      type: [String, Object],
      required: false
    },
    actionCallback: {
      type: Function,
      required: false
    },
    actionText: {
      type: String,
      required: false
    }
  },
  setup (props) {
    return props
  }
}
</script>
