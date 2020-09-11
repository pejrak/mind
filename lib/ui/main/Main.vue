<template lang="pug">
b-navbar(
  href="#"
  variant="primary"
  type="dark"
)
  b-navbar-brand Mind
  b-navbar-toggle(target="nav-collapse")
  b-collapse(id="nav-collapse" is-nav)
    main-navigation
</template>

<script>

import MainNavigation from '../navigation/MainNavigation.vue'

export default {
  components: {
    MainNavigation,
  }
}
</script>