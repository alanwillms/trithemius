<template>
  <div class="text-gray-900 bg-gray-100">
    <header
      v-if="title"
      class="flex items-center w-full text-center leading-none text-lg font-bold px-4 h-12 uppercase"
    >
      <div v-if="backRoute" class="flex-grow-0">
        <a :href="backRoute" class="text-blue-800" title="Go back">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0"
            y="0"
            viewBox="0 0 492 492"
            width="24"
            height="24"
            style="fill: currentColor;"
          >
            <path
              fill=""
              d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12
			C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084
			c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864
			l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"
            />
          </svg>
        </a>
      </div>

      <div class="flex-grow">{{ title }}</div>

      <div v-if="actionCallback" class="flex-grow-0">
        <page-button size="small" @click="actionCallback()">
          {{ actionText }}
        </page-button>
      </div>
    </header>

    <div v-if="$slots.buttons" class="flex items-center h-12 px-4">
      <slot name="buttons"></slot>
    </div>

    <div class="p-4">
      <slot />
    </div>
  </div>
</template>

<script>
import PageButton from '@/components/PageButton'

export default {
  components: {
    PageButton,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    backRoute: {
      type: [String, Object],
      required: false,
    },
    actionCallback: {
      type: Function,
      required: false,
    },
    actionText: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    return props
  },
}
</script>
