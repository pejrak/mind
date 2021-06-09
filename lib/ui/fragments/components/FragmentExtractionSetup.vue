<template lang="pug">
div
  PasswordInputDialog(
    :ref='passwordDialogId'
    title='Type your encryption password'
    fieldLabel='Encryption password'
    @submit='triggerSecretStore'
  )
  div(v-if="hasExtractionSetup")
    h5 Current public key
    b-alert(
      v-if='encryptionTestResult !== undefined'
      :variant="encryptionTestResult ? 'success' : 'danger'"
      show
    ) Encryption test result
      b  [{{ encryptionTestResult ? 'SUCCESS' : 'FAILURE' }}]

    b-alert(
      show
      variant="secondary"
    )
      pre {{ userPublicKey.substr(0, 100) }}...
    b-button-group
      b-button(
        v-if='!secretIsSet'
        variant='success'
        @click='triggerAutoExtract'
      ) Enable auto encryption
      b-button(
        v-else
        variant='warning'
        @click='disableAutoExtract'
      ) Disable auto encryption
      b-button(
        variant='primary'
        @click='triggerPublicKeyEdit'
      ) Edit key
      b-button(
        variant='danger'
        @click='triggerPublicKeyDelete'
      ) Delete
  div(v-else)
    fragment-encryption-setup

</template>
<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import FragmentEncryptionSetup from './FragmentEncryptionSetup.vue'
import PasswordInputDialog from '../../components/PasswordInputDialog.vue'
export default {
  components: {
    FragmentEncryptionSetup,
    PasswordInputDialog,
  },
  computed: {
    ...mapGetters('authentication', [
      'hasExtractionSetup',
      'secretIsSet',
    ]),
    ...mapState('authentication', [
      'userPublicKey'
    ]),
  },
  data() {
    return {
      encryptionTestResult: undefined,
      passwordDialogId: 'passwordInputDialog',
    }
  },
  methods: {
    ...mapMutations('authentication', [
      'setPublicKey',
      'setSecret',
    ]),
    ...mapActions('authentication', [
      'deletePublicKey',
      'testEncryption',
    ]),
    disableAutoExtract() {
      this.setSecret('')
    },
    triggerAutoExtract() {
      this.$refs[this.passwordDialogId].show()
    },
    triggerPublicKeyEdit() {
      this.setPublicKey('')
    },
    triggerPublicKeyDelete() {
      if (confirm('Proceed with public key removal?')) {
        this.deletePublicKey()
      }
    },
    async triggerSecretStore(secret) {
      this.setSecret(secret)
      this.encryptionTestResult = await this.testEncryption()
    },
  }
}
</script>
