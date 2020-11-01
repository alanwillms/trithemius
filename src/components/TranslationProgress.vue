<template>
  <span title="Translation progress" :class="containerClasses">
    <span aria-hidden :class="labelClasses"></span>
    <span class="relative">{{ formattedNumber }}</span>
  </span>
</template>

<script type="typescript">
const getBackgroundColor = (completeness) => {
  if (completeness === 100) {
    return 'bg-green-200'
  }

  if (completeness >= 50) {
    return 'bg-yellow-200'
  }

  return 'bg-red-200'
}

const getTextColor = (completeness) => {
  if (completeness === 100) {
    return 'text-green-900'
  }

  if (completeness >= 50) {
    return 'text-orange-600'
  }

  return 'text-red-800'
}

export default {
  props: {
    completeness: {
      type: Number,
      required: true,
    }
  },
  setup(props) {
    let evaluatedNumber = props.completeness || 0

    if (evaluatedNumber > 100) {
      evaluatedNumber = 100
    }

    if (evaluatedNumber < 0) {
      evaluatedNumber = 0
    }

    const formattedNumber = evaluatedNumber.toFixed(0) + '%'

    const containerClasses = {
      'leading-tight': true,
      'relative': true,
      'inline-block': true,
      'px-3': true,
      'py-1': true,
      'font-semibold': true,
    }

    const labelClasses = {
      'absolute': true,
      'inset-0': true,
      'opacity-50': true,
      'rounded-full': true,
    }

    labelClasses[getBackgroundColor(evaluatedNumber)] = true
    containerClasses[getTextColor(evaluatedNumber)] = true

    return {
      formattedNumber,
      containerClasses,
      labelClasses,
    }
  }
}
</script>
