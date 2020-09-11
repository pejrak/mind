<template lang="pug">
div
  b-navbar(
    href="#"
    variant="primary"
    type="dark"
  )
    b-navbar-brand Mind
    b-navbar-toggle(target="nav-collapse")
    main-navigation
    authentication-navigation
  main-content
</template>

<script>
import AuthenticationNavigation from '../authentication/components/AuthenticationNavigation.vue'
import MainNavigation from './components/MainNavigation.vue'
import MainContent from './components/MainContent.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    AuthenticationNavigation,
    MainNavigation,
    MainContent,
  },
  mounted() {
    this.getUser()
  },
  methods: {
    ...mapActions('authentication', [
      'getUser'
    ])
  },
}
</script>

<style>
.b-icon {
  margin-right: .5em;
}
</style>