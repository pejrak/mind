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
export default {
  computed: {
    keyImportInputValid() {
      return (
        this.keyImportInput.length > 10 &&
        this.keyImportInput.length < 1000
      )
    },
    setupOptions() {
      return [
        { value: 'service', text: 'Generate via this service' },
        { value: 'import', text: 'Import existing key' },
      ]
    },
  },
  data() {
    return {
      keyImportInput: '',
      setupMode: 'service',
    }
  },
  methods: {
    ...mapActions('authentication', [
      'importKey',
    ]),
    triggerKeyImport() {
      this.importKey(this.keyImportInput)
    },
  }
}
</script>
