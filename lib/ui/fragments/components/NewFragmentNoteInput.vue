<template lang="pug">
div
  b-form-textarea(
    v-model="textInput"
    placeholder="Note text..."
    :state="newFragmentNoteTextState"
  )
  br
  b-button-group
    b-button(
      :disabled="!newFragmentNoteTextIsValid"
      variant="primary"
      @click="submitNote"
    ) Submit new note
    b-button(@click="cancelAdding")
      b-icon-x-square Cancel
</template>
<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('fragments', [
      'newFragmentNoteText'
    ]),
    ...mapGetters('fragments', [
      'newFragmentNoteTextIsEmpty',
      'newFragmentNoteTextIsValid',
    ]),
    newFragmentNoteTextState() {
      return this.newFragmentNoteTextIsEmpty
        ? null
        : this.newFragmentNoteTextIsValid
    },
    textInput: {
      get() {
        return this.newFragmentNoteText
      },
      set(value) {
        this.setNewFragmentNoteText(value)
      }
    }
  },
  methods: {
    ...mapMutations('fragments', [
      'setNewFragmentNoteText',
    ]),
    ...mapActions('fragments', [
      'submitNewFragmentNote',
    ]),
    cancelAdding() {
      this.$emit('cancel')
    },
    submitNote() {
      this.submitNewFragmentNote(this.fragment.id)
      this.textInput = ''
    },
  },
  props: ['fragment'],
}
</script>
