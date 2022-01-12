<template lang="pug">
b-list-group
  b-list-group-item(
    v-for="note in fragment.notes"
    :key="`fragment-${fragment.id}-note-${note.id}`"
  )
    fragment-note(
      :note="note"
      :fragment-id="fragment.id"
    )

</template>

<script>
import FragmentNote from './FragmentNote.vue'

export default {
  components: {
    FragmentNote,
  },
  props: ['fragment']
}
</script>
