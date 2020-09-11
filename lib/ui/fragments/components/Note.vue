<template lang="pug">
div
  p.note-text {{ note.text }}
  pre {{ note }}
</template>
<script>

export default {
  /** Note shape
   * {
        id: Date.now(),
        text: options.text,
        created_at: Date.now(),
        updated_at: Date.now()
      }
   */
  props: ['note'],
}
</script>

<style>
.note-text {
  padding: 1em;
}
</style>