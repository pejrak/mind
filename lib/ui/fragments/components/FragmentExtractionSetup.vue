<template lang="pug">
div
  div(v-if="hasExtractionSetup")
    h5 Current public key
    b-alert(
      show
      variant="secondary"
    )
      pre {{ userPublicKey }}
      b-button-group
        b-button(
          variant='primary'
          @click='triggerPublicKeyEdit'
        ) Edit
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
export default {
  components: {
    FragmentEncryptionSetup,
  },
  computed: {
    ...mapGetters('authentication', [
      'hasExtractionSetup'
    ]),
    ...mapState('authentication', [
      'userPublicKey'
    ]),
  },
  methods: {
    ...mapMutations('authentication', [
      'setPublicKey'
    ]),
    ...mapActions('authentication', [
      'deletePublicKey'
    ]),
    triggerPublicKeyEdit() {
      this.setPublicKey('')
    },
    triggerPublicKeyDelete() {
      if (confirm('Proceed with public key removal?')) {
        this.deletePublicKey()
      }
    },
  }
}
</script>
