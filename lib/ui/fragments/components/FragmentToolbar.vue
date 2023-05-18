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
        v-if="isForgettable"
      )
        b-icon-bookmark-dash
        span Forget

      b-button(
        v-if='isRecallable'
        @click="triggerRecollect"
        variant="primary"
      )
        b-icon-bookmark-check
        span Recollect
      b-button(
        v-if='isMemorizable'
        @click="triggerRecollect"
        variant="danger"
      )
        b-icon-bookmark-check
        span Remember

      b-button(@click="toggleNotes")
        b-icon-journal
        span Notes
          span(
            v-if='fragment.notes.length'
          )  ({{ fragment.notes.length }})

      b-button(@click="triggerRemoval")
        b-icon-trash
        span Remove

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
    isForgettable() {
      return !this.fragment.forgotten
    },
    isMemorizable() {
      return !this.fragment.forgotten && this.fragment.collected
    },
    isRecallable() {
      return this.fragment.forgotten
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
