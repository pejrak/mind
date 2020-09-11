<template lang="pug">
b-card.fragment-card(
  border-variant='secondary'
)
  fragment-toolbar(
    :fragment="fragment"
    @toggleNotes="toggleNotes"
  )
  p.fragment-text.text-break {{ fragment.text }}
  hr
  small.text-secondary
    span(
      title='Has been updated since creation.'
      v-if='updatedLaterThanCreated'
    )
      b-icon-pencil
    span At #[strong {{ updatedAtFormatted }}]
    span  by #[strong {{ fragment.owner }}]
</template>
<script>
import FragmentToolbar from './FragmentToolbar.vue'

const formatTime = require('../../../format/time')

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
    updatedAtFormatted() {
      return formatTime(this.fragment.updated_at)
    },
    updatedLaterThanCreated() {
      return (this.fragment.updated_at > this.fragment.created_at)
    }
  },
  data() {
    return {
      showNotes: false,
    }
  },
  methods: {
    toggleNotes(show) {
      this.showNotes = show
    },
  },
  props: ['fragment'],
}
</script>

<style>
.fragment-card {
  margin-bottom: 1em;
}
.fragment-text {
  padding-top: .5em;
  padding-left: .5em;
  line-height: 1.8;
}
</style>