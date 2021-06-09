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
        @click="triggerForget"
        v-if="!fragment.forgotten"
      )
        b-icon-bookmark-dash
        span Forget

      b-button(
        v-else
        @click="triggerRecollect"
        variant="primary"
      )
        b-icon-bookmark-check
        span Recollect

      b-button(@click="toggleNotes")
        b-icon-journal
        span Notes
          span(
            v-if='fragment.notes.length'
          )  ({{ fragment.notes.length }})

      b-button(@click="triggerRemoval")
        b-icon-trash
        span Remove

    b-button-group(
      size="sm"
    )
      b-button(disabled)
        b-icon-diagram2
        span {{ pathFormatted }}
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
    pathFormatted() {
      return this.fragment.path.join(' - ')
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
        .show().onConfirm(() => {
          this.removeFragment(this.fragment.id)
        })
    },
  },
}
</script>
