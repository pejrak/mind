<template lang="pug">
b-container
  h2.text-center {{ selectedFragmentPathTitle }}
  br
  b-row(deck)
    b-col(
      v-for="fragment of fragments"
      :key="fragment.id"
      lg="6"
      md="6"
    )
      fragment(:fragment="fragment")
</template>
<script>
import Fragment from './Fragment.vue'
import { generateMockFragments } from '../generateMockFragments'
import { mapGetters } from 'vuex'

export default {
  components: {
    Fragment,
  },
  computed: {
    ...mapGetters('fragmentPaths', [
      'selectedFragmentPathTitle'
    ]),
    fragments() {
      return generateMockFragments(10)
    },
  }
}
</script>

<style>
.fragment-container {
  min-width: 5em;

}
</style>