<template lang="pug">
div
  h2.text-center {{ selectedFragmentPathTitle }}
  br
  TrustList(:fragmentPath='selectedFragmentPath')

  slot
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  components: {
    TrustList: () => import('../../trusts/components/TrustList.vue'),
  },
  computed: {
    ...mapState('trusts', [
      'outgoing',
    ]),
    ...mapState('fragmentPaths', [
      'selectedFragmentPath',
    ]),
    ...mapGetters('fragmentPaths', [
      'selectedFragmentPathTitle',
    ]),
  },
}
</script>
