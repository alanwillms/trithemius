<template>
  <button :title="title" :class="cssClasses" type="button" :disabled="disabled">
    <slot />
  </button>
</template>

<script>
import { watch, reactive } from 'vue'

const configureCssClasses = (cssClasses, props) => {
  Object.keys(cssClasses).forEach(cssClass => {
    delete cssClasses[cssClass]
  })

  cssClasses['font-bold'] = true
  cssClasses.uppercase = true
  cssClasses.border = true
  cssClasses['cursor-pointer'] = true
  cssClasses['leading-none'] = true
  cssClasses['rounded-lg'] = true
  cssClasses['w-full'] = true
  cssClasses['focus:outline-none'] = true
  cssClasses['focus:shadow-outline'] = true

  if (props.disabled) {
    cssClasses['text-gray-900'] = true
    cssClasses['bg-gray-500'] = true
    cssClasses['hover:bg-gray-600'] = true
    cssClasses['active:bg-gray-600'] = true
  } else if (props.type === 'danger') {
    cssClasses['text-white'] = true
    cssClasses['bg-red-500'] = true
    cssClasses['hover:bg-red-600'] = true
    cssClasses['active:bg-Red-600'] = true
  } else if (props.type === 'primary') {
    cssClasses['text-white'] = true
    cssClasses['bg-blue-500'] = true
    cssClasses['hover:bg-blue-600'] = true
    cssClasses['active:bg-blue-600'] = true
  } else {
    cssClasses['text-black'] = true
    cssClasses['bg-gray-200'] = true
    cssClasses['hover:bg-gray-400'] = true
    cssClasses['active:bg-gray-400'] = true
  }

  if (props.size === 'small') {
    cssClasses['p-2'] = true
    cssClasses['text-sm'] = true
  } else {
    cssClasses['p-4'] = true
  }
}

export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    type: {
      type: String,
      required: false,
      default: 'default',
    },
    size: {
      type: String,
      required: false,
      default: 'normal',
    },
    title: String,
  },
  setup(props) {
    const cssClasses = reactive({})

    watch(
      () => props.disabled,
      (first, second) => {
        configureCssClasses(cssClasses, props)
      },
    )

    configureCssClasses(cssClasses, props)

    return {
      cssClasses,
    }
  },
}
</script>
