<template lang="pug">
div
  small
    strong {{ timeLabel }}:
    span.note-text  {{ note.text }}
</template>
<script>
const formatTime = require('../../../format/time')
export default {
  /** Note shape
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
  props: ['note'],
}
</script>

<style>
.note-text {
  white-space: pre-wrap;
}
</style>
