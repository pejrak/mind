<template lang="pug">
b-modal(
  :ref='passwordDialogModalId'
  ok-only=true
  ok-title="Close"
  :title="title || 'Password confirmation'"
  @ok="triggerCancelation"
  @cancel="triggerCancelation"
  @close="triggerCancelation"
)
  b-form(
    @submit.prevent='triggerSubmit'
  )
    b-input-group(
      :prepend='fieldLabel || "Password"'
    )
      b-input(
        type='password'
        v-model='fieldValue'
      )
      b-button(
        type='submit'
        :disabled='!fieldValueIsValid'
      ) Submit
  .spacer
  slot
</template>
<script>
const passwordDialogModalId = 'passwordInputDialogModal'
export default {
  data() {
    return {
      cancelFn: null,
      confirmFn: null,
      fieldValue: '',
      defaultConfirmationMessage: 'Password input',
      passwordDialogModalId,
    }
  },
  computed: {
    dialog() {
      return this.$refs[passwordDialogModalId]
    },
  },
  methods: {
    show() {
      this.dialog.show()
      return this
    },
    hide() {
      this.dialog.hide()
      return this
    },
    onCancel(cancelFn) {
      this.cancelFn = cancelFn
    },
    onSubmit(submitFn) {
      this.submitFn = submitFn
    },
    triggerCancelation() {
      this.$emit('cancel')
      if (typeof this.cancelFn === 'function') {
        this.cancelFn()
      }
    },
    triggerSubmit() {
      this.$emit('submit', this.fieldValue)
      if (typeof this.submitFn === 'function') {
        this.submitFn(this.fieldValue)
      }
      this.hide()
    },
    fieldValueIsValid() {
      return (
        typeof this.fieldValue === 'string' &&
        this.fieldValue.length > 0
      )
    },
  },
  props: [
    'confirmOnly',
    'fieldLabel',
    'title',
  ],
}
</script>
