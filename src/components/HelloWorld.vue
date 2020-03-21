<template>
  <div class="hello">
    <p>Source text:</p>
    <p>
      <textarea v-model="state.sourceText"></textarea>
    </p>
    <p>
      <button type="button" @click="translate">
        Translate
      </button>
    </p>
  </div>
</template>

<script>
import { reactive } from 'vue'

export default {
  setup () {
    const state = reactive({
      sourceText: ''
    })

    const translate = () => {
      console.log('Translating...')
    }

    return {
      state,
      translate
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
