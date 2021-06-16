<template lang="pug">
div
  b-form-textarea(
    v-model="textInput"
    placeholder="... text ..."
    :state="newFragmentNoteTextState"
  )
  br
  b-button(
    :disabled="!newFragmentNoteTextIsValid"
    variant="primary"
    @click="submitFragmentNote"
  ) Add
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
        return this.newFragmentText
      },
      set(value) {
        this.setNewFragmentText(value)
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
    async submitNote() {
      this.submitNewFragmentNote(this.fragment.id)
    }
  },
  props: ['fragment'],
}
</script>
