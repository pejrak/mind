<template lang="pug">
div
  small You can generate a new key via this service or import an existing one.
  b-select(
    :options="setupOptions"
    v-model="setupMode"
  )
  .spacer
  div(v-if="setupMode === 'service'")
    h5 Service
    b-alert(
      show
      variant="info"
    ) You will need to set a password for your new key.
      |  The password will not be stored by this service.
      |  You will need to remember it.
    .spacer
    b-form-group(
      :state="passwordInputState"
      :invalid-feedback="invalidPasswordInputLabel"
    )
      b-input-group(
        prepend="*"
      )
        b-form-input(
          type="password"
          v-model="passwordInput"
          :state="passwordInputState"
        )
    b-form-group(
      :state="passwordRepeatInputState"
      invalid-feedback="Passwords have to match."
    )
      b-input-group(
        prepend="*"
      )
        b-form-input(
          type="password"
          v-model="passwordRepeatInput"
          :state="passwordRepeatInputState"
        )
    b-button(
      @click="triggerKeyGeneration"
    ) Obtain keys
  div(v-else-if="setupMode === 'import'")
    h5 Import
    b-textarea(
      placeholder="Here goes your public PGP key"
      v-model="keyImportInput"
    )
    .spacer
    b-button(
      variant="primary"
      :disabled="!keyImportInputValid"
      @click="triggerKeyImport"
    )
      b-icon-cloud-upload
      span Import key
</template>

<script>
import { mapActions } from 'vuex'
const PWD_CHAR_LIMITS = {
  max: 200,
  min: 6,
}

export default {
  computed: {
    invalidPasswordInputLabel() {
      return (
        'Password has to be between ' +
        `${PWD_CHAR_LIMITS.min} and ${PWD_CHAR_LIMITS.max} long.`
      )
    },
    keyImportInputValid() {
      return (
        this.keyImportInput.length > 10 &&
        this.keyImportInput.length < 1000
      )
    },
    passwordInputEmpty() {
      return this.passwordInput === ''
    },
    passwordsMatch() {
      return (
        this.passwordInput === this.passwordRepeatInput
      )
    },
    passwordInputIsValid() {
      return (
        this.passwordInput.length >= PWD_CHAR_LIMITS.min &&
        this.passwordInput.length <= PWD_CHAR_LIMITS.max
      )
    },
    passwordInputState() {
      return (
        this.passwordInputEmpty ? null : this.passwordInputIsValid
      )
    },
    passwordRepeatInputState() {
      return (
        this.passwordInputEmpty ? null : this.passwordsMatch
      )
    },
    setupOptions() {
      return [
        { value: 'service', text: 'Generate via this service' },
        // { value: 'import', text: 'Import existing key' },
      ]
    },
  },
  data() {
    return {
      keyImportInput: '',
      passwordInput: '',
      passwordRepeatInput: '',
      PWD_CHAR_LIMITS,
      setupMode: 'service',
    }
  },
  methods: {
    ...mapActions('authentication', [
      'importKey',
      'generateKey',
    ]),
    async triggerKeyImport() {
      const success = await this.importKey(this.keyImportInput)

      if (success) {
        this.keyImportInput = ''
      }
    },
    async triggerKeyGeneration() {
      await this.generateKey(this.passwordInput)
    },
  }
}
</script>
