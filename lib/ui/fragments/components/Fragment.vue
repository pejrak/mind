<template lang="pug">
b-card.fragment-card(
  :border-variant="fragment.forgotten ? 'warning' : 'dark'"
  bg-variant='secondary'
)
  DebugContent(:modalId='`fragment-${fragment.id}-debug`')
    pre {{ fragment }}
  fragment-toolbar(
    :fragment="fragment"
    @toggleNotes="toggleNotes"
  )
  p.fragment-text.text-break(v-html="fragment.text" v-linkified)
  .spacer
  b-button-toolbar
    b-button-group(
      size="sm"
    )
      b-button(
        disabled
        variant="outline-primary"
      )
        b-icon-diagram2
        span {{ pathFormatted }}
    b-button-group(
      size="sm"
    )
      FragmentPrivacyIndicator(
        :fragment='fragment'
      )
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
  b-button-group
    b-button(disabled)
      b(v-if='hasNotes') Notes ({{ fragment.notes.length }})
      span(v-else) No notes
    b-button(@click='addingNote = !addingNote')
      b-icon-journal-plus(v-if='!addingNote')
      b-icon-x-square(v-else)
  div(v-if='addingNote')
    NewFragmentNoteInput(
      :fragment='fragment'
      @cancel='addingNote = false'
    )
  div(v-if='hasNotes')
    .spacer
    fragment-notes(
      :fragment="fragment"
    )

</template>
<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import FragmentNotes from './FragmentNotes.vue'
import FragmentPrivacyIndicator from './FragmentPrivacyIndicator.vue'
import FragmentToolbar from './FragmentToolbar.vue'
import NewFragmentNoteInput from './NewFragmentNoteInput.vue'
import linkify from 'vue-linkify'
import { formatTime } from '../../../format/formatTime'
import { DebugContent } from '../../components/DebugContent.vue'

Vue.directive('linkified', linkify)

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
    DebugContent,
    FragmentNotes,
    FragmentPrivacyIndicator,
    FragmentToolbar,
    NewFragmentNoteInput,
  },
  computed: {
    ...mapState('authentication', [
      'userEmail'
    ]),
    hasNotes() {
      return this.fragment.notes && this.fragment.notes.length > 0
    },
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
