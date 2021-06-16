<template lang="pug">
div
  b-navbar-toggle(target="nav-collapse")
  b-collapse(id="nav-collapse" is-nav)
    b-navbar-nav
      b-nav-item(v-b-modal="`fragmentExtractionSetupModal`") Setup
    b-navbar-nav
      MainMemoryControls
    b-navbar-nav
      FragmentPathSelection
</template>
<script>
import MainMemoryControls from './MainMemoryControls.vue'
import FragmentPathSelection from '../../fragmentPaths/components/FragmentPathSelection.vue'

export default {
  components: {
    MainMemoryControls,
    FragmentPathSelection,
  }
}
</script>
