<template lang="pug">
div
  b-navbar(
    href="#"
    variant="primary"
    type="dark"
    fixed="top"
    toggleable="md"
  )
    //- b-navbar-brand Mind
    MainNavigation
    AuthenticationNavigation
  MainContent
  b-navbar(
    href="#"
    variant="secondary"
    fixed="bottom"
    toggleable="md"
  )
    BottomNavigation
</template>

<script>
import AuthenticationNavigation from '../authentication/components/AuthenticationNavigation.vue'
import BottomNavigation from './components/BottomNavigation.vue'
import MainNavigation from './components/MainNavigation.vue'
import MainContent from './components/MainContent.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    AuthenticationNavigation,
    BottomNavigation,
    MainContent,
    MainNavigation,
  },
  computed: {
    ...mapGetters('authentication', [
      'isAuthenticated',
    ]),
    ...mapGetters('fragments', [
      'memoryIsEmpty',
    ]),
  },
  async mounted() {
    await this.getUser()
    if (this.isAuthenticated && this.memoryIsEmpty) {
      await this.load()
    }
  },
  methods: {
    ...mapActions('authentication', [
      'getUser',
    ]),
    ...mapActions('fragments', [
      'load',
    ]),
  },
}
</script>

<style>
.b-icon {
  margin-right: .5em;
}
body {
  padding: 4em 0;
}
</style>
