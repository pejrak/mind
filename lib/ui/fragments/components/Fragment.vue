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
  .spacer
    b-button-group(
      size="sm"
    )
      b-button(
        disabled
        variant="outline-primary"
      )
        b-icon-diagram2
        span {{ pathFormatted }}
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
  div(v-if='addingNote')
    NewFragmentNoteInput(
      :fragment='fragment'
      @cancel='addingNote = false'
    )
  b-button(
    v-else
    @click='addingNote = true'
    title='Add new note'
  )
    b-icon-journal-plus
  div(
    v-if='fragment.notes && fragment.notes.length > 0'
  )
    b Notes ({{ fragment.notes.length }})
    .spacer
    fragment-notes(
      :fragment="fragment"
    )
  small(v-else) No notes
</template>
<script>
import { mapState } from 'vuex'
import FragmentNotes from './FragmentNotes.vue'
import FragmentToolbar from './FragmentToolbar.vue'
import NewFragmentNoteInput from './NewFragmentNoteInput.vue'

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
    NewFragmentNoteInput,
  },
  computed: {
    ...mapState('authentication', [
      'userEmail'
    ]),
    pathFormatted() {
      return this.fragment.path.join(' - ')
    },
    updatedAtFormatted() {
      return formatTime(this.fragment.updatedAt)
    },
    updatedLaterThanCreated() {
      return (this.fragment.updatedAt > this.fragment.createdAt)
    },
  },
  data() {
    return {
      addingNote: false,
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
  line-height: 1.8;
  padding-top: .5em;
  padding-left: .5em;
  white-space: pre-wrap;
}
</style>
