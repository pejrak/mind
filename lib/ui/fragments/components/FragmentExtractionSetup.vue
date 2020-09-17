<template lang="pug">
div
  div(v-if="hasExtractionSetup")
    h5 Current public key
    b-alert(
      show
      variant="secondary"
    )
      pre {{ userPublicKey }}
      b-button(
        variant='primary'
        @click='triggerPublicKeyEdit'
      ) Edit
  div(v-else)
    fragment-encryption-setup

</template>
<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
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
    triggerPublicKeyEdit() {
      this.setPublicKey('')
    },
  }
}
</script>
