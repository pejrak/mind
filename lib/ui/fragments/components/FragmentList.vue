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
            ) Include forgotten
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
      'searchIncludeForgotten',
      'searchAllPaths',
    ]),
    ...mapGetters('fragmentPaths', [
      'selectedFragmentPathTitle'
    ]),
    fragments() {
      return generateMockFragments(10)
    },
    searchAllPathsInput: {
      get() {
        return this.searchAllPaths
      },
      set(val) {
        this.setSearchAllPaths(val)
      }
    },
    searchIncludeForgottenInput: {
      get() {
        return this.searchIncludeForgotten
      },
      set(val) {
        this.setSearchIncludeForgotten(val)
      }
    },
    searchQueryInput: {
      get() {
        return this.searchQuery
      },
      set(val) {
        clearTimeout(this.queryDebouncer)
        this.queryDebouncer = setTimeout(() => {
          this.setSearchQuery(val)
        }, 300)
      },
    },
  },
  data() {
    return {
      queryDebouncer: null
    }
  },
  methods: {
    ...mapMutations('fragments', [
      'setSearchQuery',
      'setSearchAllPaths',
      'setSearchIncludeForgotten',
    ])
  },
}
</script>

<style>
.fragment-container {
  min-width: 5em;

}
</style>