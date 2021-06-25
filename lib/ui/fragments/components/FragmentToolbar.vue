<template lang="pug">
div
  confirmation-dialog(
    :ref="confirmationDialogReference"
  )
  b-button-toolbar
    b-button-group.offset-right(
      size="sm"
    )
      b-button(
        v-if="!fragment.forgotten"
        variant='primary'
        @click="triggerForget"
      )
        b-icon-bookmark-dash
        span Forget

      b-button(
        v-else
        @click="triggerRecollect"
        variant="warning"
      )
        b-icon-bookmark-check
        span Recollect

      b-button(
        variant='primary'
        @click="toggleNotes"
      )
        b-icon-journal
        span Notes
          span(
            v-if='fragment.notes.length'
          )  ({{ fragment.notes.length }})

      b-button(
        @click="triggerRemoval"
        variant="danger"
      )
        b-icon-trash
        | Remove

</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import ConfirmationDialog from '../../components/ConfirmationDialog.vue'
export default {
  props: ['fragment'],
  components: {
    ConfirmationDialog,
  },
  computed: {
    confirmationDialogReference() {
      return `removal-cofirmation-dialog-${this.fragment.id}`
    },
    hasNotes() {
      return this.fragment.notes.length > 0
    },
  },
  methods: {
    ...mapActions('fragments', [
      'forgetFragment',
      'recollectFragment',
    ]),
    ...mapMutations('fragments', [
      'removeFragment',
      'showNotes',
    ]),
    toggleNotes() {
      this.showNotes(this.fragment.id)
    },
    triggerForget() {
      this.forgetFragment(this.fragment.id)
    },
    triggerRecollect() {
      this.recollectFragment(this.fragment.id)
    },
    triggerRemoval() {
      this.$refs[this.confirmationDialogReference]
        .show().onConfirm(() => this.removeFragment(this.fragment.id))
    },
  },
}
</script>
