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
        createdAt: Date.now(),
        updatedAt: Date.now(),
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