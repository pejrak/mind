<template lang="pug">
b-modal(
  ref='confirmationDialogModal'
  :ok-title="confirmTitle || 'Yes'"
  :title="modalTitle || 'Confirmation required'"
  @ok="triggerConfirmation"
  @cancel="triggerCancelation"
  @close="triggerCancelation"
)
  .text-alert {{ confirmationMessage || defaultConfirmationMessage }}
  .spacer
  slot
</template>
<script>
export default {
  data() {
    return {
      confirmFn: null,
      cancelFn: null,
      defaultConfirmationMessage: 'OK to proceed?'
    }
  },
  methods: {
    show() {
      this.$refs['confirmationDialogModal'].show()

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
    'confirmTitle',
    'modalTitle',
  ],
}
</script>