<template lang="pug">
b-modal(
  :ref='confirmationDialogModalId'
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
const confirmationDialogModalId = 'confirmationDialogModal'
export default {
  data() {
    return {
      confirmationDialogModalId,
      confirmFn: null,
      cancelFn: null,
      defaultConfirmationMessage: 'OK to proceed?'
    }
  },
  methods: {
    show() {
      this.$refs[confirmationDialogModalId].show()

      return this
    },
    hide() {
      this.$refs[confirmationDialogModalId].hide()

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
  ],
}
</script>
