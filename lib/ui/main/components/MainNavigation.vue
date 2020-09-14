<template lang="pug">
div
  b-collapse(id="nav-collapse" is-nav)
    b-navbar-nav
      b-nav-item(href="#") Load
      b-nav-item(v-b-modal="`fragment-extraction-setup`") Extract
</template>
<script>
export default {
  computed: {

  }
}
</script>