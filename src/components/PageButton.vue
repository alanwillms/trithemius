<template>
  <button
    :class="cssClasses" type="button" :disabled="disabled">
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
    },
    type: {
      type: String,
      required: false,
      default: 'default'
    },
    size: {
      type: String,
      required: false,
      default: 'normal'
    }
  },
  setup (props) {
    const cssClasses = {
      'font-bold': true,
      uppercase: true,
      'leading-none': true,
      'rounded-lg': true,
      'w-full': true
    }

    if (props.type === 'danger') {
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
      cssClasses['bg-gray-500'] = true
      cssClasses['hover:bg-gray-600'] = true
      cssClasses['active:bg-gray-600'] = true
    }

    if (props.size === 'small') {
      cssClasses['p-2'] = true
      cssClasses['text-sm'] = true
    } else {
      cssClasses['p-4'] = true
    }

    return {
      cssClasses
    }
  }
}
</script>
