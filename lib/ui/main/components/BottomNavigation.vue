<template lang="pug">
div
  b-navbar-toggle(target="nav-collapse")
  b-collapse(id="nav-collapse" is-nav)
    TrustControls
</template>
<script>
import TrustControls from '../../trusts/components/TrustControls.vue'

export default {
  components: {
    TrustControls,
  },
}
</script>
