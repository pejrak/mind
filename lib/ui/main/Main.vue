<template lang="pug">
div
  b-navbar(
    href="#"
    variant="primary"
    type="dark"
    fixed="top"
    toggleable="md"
  )
    b-navbar-brand(to='/') Mind
    MainNavigation
    AuthenticationNavigation
  MainContent
  b-navbar(
    href="#"
    variant="primary"
    type="dark"
    fixed="bottom"
    toggleable="md"
  )
    PeerConnectionControls
</template>

<script>
import AuthenticationNavigation from '../auth/components/AuthenticationNavigation.vue'
import MainNavigation from './components/MainNavigation.vue'
import MainContent from './components/MainContent.vue'
import PeerConnectionControls from '../components/PeerConnectionControls.vue'
import { mapActions } from 'vuex'

export default {
  components: {
    AuthenticationNavigation,
    MainContent,
    MainNavigation,
    PeerConnectionControls,
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
