<template lang="pug">
div
  div(v-if="hasExtractionSetup")
    pre {{ userPublicKey }}
  div(v-else)
    fragment-encryption-setup

</template>
<script>
import { mapGetters, mapState } from 'vuex'
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
}
</script>
