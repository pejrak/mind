<template lang="pug">
div
  fragment-toolbar(
    :fragment="fragment"
  )
  p.fragment-text {{ fragment.text }}
</template>
<script>
import FragmentToolbar from './FragmentToolbar.vue'

export default {
  /** Fragment shape
   * {
        id,
        text,
        created_at,
        updated_at,
        path,
        notes: Array,
        memorized: Boolean,
        owner,
      }
   */
  components: {
    FragmentToolbar,
  },
  computed: {
    pathFormatted() {
      return this.fragment.path.join(' - ')
    },
  },
  props: ['fragment'],
}
</script>

<style>
.fragment-text {
  padding: 1em;
}
</style>