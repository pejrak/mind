<template lang="pug">
div
  b-navbar-toggle(target="nav-collapse")
  b-collapse(id="nav-collapse" is-nav)
    b-navbar-nav
      b-nav-item(v-b-modal="`fragmentExtractionSetupModal`") Setup
</template>
<script>

export default {
  //
}
</script>
