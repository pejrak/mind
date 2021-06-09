<template lang="pug">
b-modal(
  :ref='dialogReference'
  :ok-title="confirmTitle || 'Yes'"
  :ok-only="confirmOnly"
  :title="dialogTitle || 'Confirmation required'"
  @ok="triggerConfirmation"
  @cancel="triggerCancelation"
  @close="triggerCancelation"
)
  .text-alert(
    v-if='confirmationMessage !== false'
  ) {{ confirmationMessage || defaultConfirmationMessage }}
  .spacer
  slot
</template>
<script>
const defaultDialogReference = 'confirmationDialogModal'
export default {
  computed: {
    dialogReference() {
      return (this.dialogRef || defaultDialogReference)
    }
  },
  data() {
    return {
      confirmFn: null,
      cancelFn: null,
      defaultConfirmationMessage: 'OK to proceed?'
    }
  },
  methods: {
    show() {
      this.$refs[this.dialogReference].show()

      return this
    },
    hide() {
      this.$refs[this.dialogReference].hide()

      return this
    },
    onConfirm(confirmFn) {
      this.confirmFn = confirmFn
    },
    onCancel(cancelFn) {
      this.cancelFn = cancelFn
    },
    triggerConfirmation() {
      this.$emit('confirm')
      if (typeof this.confirmFn === 'function') {
        this.confirmFn()
      }
    },
    triggerCancelation() {
      this.$emit('cancel')
      if (typeof this.cancelFn === 'function') {
        this.cancelFn()
      }
    },
  },
  props: [
    'confirmationMessage',
    'confirmOnly',
    'confirmTitle',
    'dialogTitle',
    'dialogRef',
  ],
}
</script>
