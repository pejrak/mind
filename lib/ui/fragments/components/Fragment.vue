<template lang="pug">
b-card.fragment-card(
  :border-variant="fragment.forgotten ? 'warning' : 'dark'"
  bg-variant='secondary'
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
    span(
      v-if="!fragment.owner || fragment.owner === userEmail"
    )  by #[strong.text-success me]
    span(v-else)  by #[strong {{ fragment.owner }}]
  .spacer
  div(
    v-if='fragment.notes && fragment.notes.length > 0'
  )
    b Notes ({{ fragment.notes.length }})
    .spacer
    fragment-notes(
      :fragment="fragment"
    )
</template>
<script>
import { mapState } from 'vuex'
import FragmentNotes from './FragmentNotes.vue'
import FragmentToolbar from './FragmentToolbar.vue'

const formatTime = require('../../../format/time')

export default {
  /** Fragment shape
   * {
        id,
        text,
        createdAt,
        updatedAt,
        path,
        notes: Array,
        memorized: Boolean,
        owner,
      }
   */
  components: {
    FragmentNotes,
    FragmentToolbar,
  },
  computed: {
    ...mapState('authentication', [
      'userEmail'
    ]),
    updatedAtFormatted() {
      return formatTime(this.fragment.updatedAt)
    },
    updatedLaterThanCreated() {
      return (this.fragment.updatedAt > this.fragment.createdAt)
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