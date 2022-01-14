<template lang="pug">
div
  small
    strong {{ timeLabel }}:
    b-button.float-right(
      :variant="toConfirmRemoval ? 'success': 'secondary'"
      @click="onRemoveNote"
    )
      b-icon-journal-x
    span.note-text  {{ note.text }}
</template>
<script>
import { mapMutations } from 'vuex'
import { formatTime } from '../../../format/formatTime.js'

export default {
  /** Note shape
   *
   * {
        id: Date.now(),
        text: options.text,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
   */
  computed: {
    timeLabel() {
      return `${formatTime(this.note.updated_at)}`
    },
  },
  data() {
    return {
      toConfirmRemoval: false,
    }
  },
  methods: {
    ...mapMutations('fragments', ['removeFragmentNote']),
    onRemoveNote() {
      if (this.toConfirmRemoval) {
        this.removeFragmentNote({
          fragmentId: this.fragmentId,
          noteId: this.note.id,
        })
      }
      this.toConfirmRemoval = !this.toConfirmRemoval
    }
  },
  props: ['fragmentId', 'note'],
}
</script>

<style>
.note-text {
  white-space: pre-wrap;
}
</style>
