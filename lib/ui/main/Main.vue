<template lang="pug">
div
  b-navbar(
    href="#"
    variant="primary"
    type="dark"
    fixed="top"
  )
    b-navbar-brand Mind
    MainNavigation
    b-navbar-nav
      MainMemoryControls
      FragmentPathSelection
    AuthenticationNavigation
  MainContent
</template>

<script>
import AuthenticationNavigation from '../authentication/components/AuthenticationNavigation.vue'
import FragmentPathSelection from '../fragmentPaths/components/FragmentPathSelection.vue'
import MainMemoryControls from './components/MainMemoryControls.vue'
import MainNavigation from './components/MainNavigation.vue'
import MainContent from './components/MainContent.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    AuthenticationNavigation,
    FragmentPathSelection,
    MainContent,
    MainMemoryControls,
    MainNavigation,
  },
  mounted() {
    this.getUser()
  },
  methods: {
    ...mapActions('authentication', [
      'getUser',
    ])
  },
}
</script>

<style>
.b-icon {
  margin-right: .5em;
}
body {
  padding-top: 4em;
}
</style>
