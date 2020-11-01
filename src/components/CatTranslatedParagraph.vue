<template>
  <div>
    <div v-if="isEditable">
      <textarea
        id="text-being-edited"
        :class="{
          'p-4': true,
          border: true,
          'font-mono': true,
          'border-transparent': !isEditable,
          'border-red-700': isEditable,
          'w-full': true,
          'resize-none': true,
        }"
        :value="textBeingEdited"
        @input="inputHandler($event)"
        autofocus
      >
      </textarea>

      <div class="font-sans p-4 flex w-full justify-end">
        <button
          @click="$emit('repeat')"
          type="button"
          class="rounded bg-orange-600 text-white py-2 px-4"
        >
          Repeat
        </button>

        <button
          @click="$emit('cancel')"
          type="button"
          class="ml-4 rounded bg-red-600 text-white py-2 px-4"
        >
          Cancel
        </button>

        <button
          @click="$emit('save')"
          type="button"
          class="ml-4 rounded bg-blue-600 text-white py-2 px-4"
        >
          Save
        </button>
      </div>
    </div>

    <div
      v-else
      :class="{
        'p-4': true,
        border: true,
        'text-red-800': !paragraph.touched,
        'font-serif': true,
        'border-transparent': true,
      }"
      @click="$emit('select')"
    >
      <div
        v-for="(line, lineKey) in paragraph.translation.split('\n')"
        v-bind:key="lineKey"
      >
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, nextTick, watch } from 'vue'
import { useStore } from 'vuex'
export default {
  props: {
    paragraph: {
      type: Object,
      required: true,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
    modelValue: String,
  },
  setup(props) {
    const store = useStore()
    const textBeingEdited = computed(() => store.state.textBeingEdited)
    const setTextBeingEdited = value => {
      store.dispatch('setTextBeingEdited', value)
    }
    const autoGrow = element => {
      try {
        element.style.height = '5px'
        element.style.height = element.scrollHeight + 10 + 'px'
      } catch (error) {
        console.log(error)
      }
    }
    watch(
      () => props.isEditable,
      value => {
        if (value) {
          nextTick(() => {
            const element = document.getElementById('text-being-edited')
            autoGrow(element)
            element.focus()
          })
        }
      },
    )
    const inputHandler = $event => {
      autoGrow($event.target)
      setTextBeingEdited($event.target.value)
    }
    return {
      inputHandler,
      textBeingEdited,
    }
  },
}
</script>
