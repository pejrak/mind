<template lang="pug">
div
  h2 Extraction setup
</template>
<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import PasswordInputDialog from '../../components/PasswordInputDialog.vue'
export default {
  components: {
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
