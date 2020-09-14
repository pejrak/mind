<template lang="pug">
b-container
  h2.text-center {{ selectedFragmentPathTitle }}
  br
  b-row
    b-col(
      md="2"
    )
    b-col
      b-input-group
        b-input-group-prepend
          b-input-group-text
            b-icon-search
            span Search
        b-input(
          type='text'
          v-model='searchQueryInput'
        )
        b-input-group-append
          b-input-group-text
            b-checkbox(
              v-model='searchIncludeForgottenInput'
            ) Find forgotten
          b-input-group-text
            b-checkbox(
              v-model='searchAllPathsInput'
            ) All paths
    b-col(
      md="2"
    )
  br
  b-row(
    v-if="displayedFragments.length > 0"
    deck
  )
    b-col(
      v-for="fragment of displayedFragments"
      :key="fragment.id"
      lg="6"
      md="6"
    )
      fragment(:fragment="fragment")
  b-row(
    v-else
    deck
  )
    b-alert(
      show
      variant='info'
    ) Found nothing.
</template>
<script>
import Fragment from './Fragment.vue'
import {
  mapGetters,
  mapMutations,
  mapState,
} from 'vuex'

export default {
  components: {
    Fragment,
  },
  computed: {
    ...mapGetters('fragments', [
      'displayedFragments',
    ]),
    ...mapState('fragments', [
      'searchQuery',
    ]),
    ...mapGetters('fragmentPaths', [
      'selectedFragmentPathTitle'
    ]),
    fragments() {
      return generateMockFragments(10)
    },
    searchQueryInput: {
      get() {
        return this.searchQuery
      },
      set(val) {
        this.setSearchQuery(val)
      },
    },
  },
  data() {
    return {
      searchIncludeForgottenInput: true,
      searchAllPathsInput: true,
    }
  },
  methods: {
    ...mapMutations('fragments', [
      'setSearchQuery',
    ])
  },
}
</script>

<style>
.fragment-container {
  min-width: 5em;

}
</style>