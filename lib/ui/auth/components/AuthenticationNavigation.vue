<template lang="pug">
b-navbar-nav.ml-auto
  b-nav-item-dropdown(
    v-if="isAuthenticated"
    :text="userEmail"
  )
    b-dropdown-item(
      href="/logout"
    ) Logout
  b-nav-item(
    v-else
    to="/login"
  ) Login
</template>
<script>
import { mapGetters, mapState } from 'vuex'
export default {
  computed: {
    ...mapGetters('authentication', ['isAuthenticated']),
    ...mapState('authentication', ['userEmail']),
  },
}
</script>
