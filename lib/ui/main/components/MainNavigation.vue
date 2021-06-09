<template lang="pug">
div
  b-navbar-toggle(target="nav-collapse")
  b-collapse(id="nav-collapse" is-nav)
    b-navbar-nav
      b-nav-item(href="#") Load
      b-nav-item(v-b-modal="`fragment-extraction-setup`") Setup
</template>
<script>

export default {
  components: {
  }
}
</script>
