<template lang="pug">
div
  b-navbar(
    href="#"
    variant="primary"
    type="dark"
  )
    b-navbar-brand Mind
    main-navigation
    b-navbar-nav
      fragment-path-selection
    authentication-navigation
  main-content
</template>

<script>
import AuthenticationNavigation from '../authentication/components/AuthenticationNavigation.vue'
import FragmentPathSelection from '../fragmentPaths/components/FragmentPathSelection.vue'
import MainNavigation from './components/MainNavigation.vue'
import MainContent from './components/MainContent.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    AuthenticationNavigation,
    FragmentPathSelection,
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