<template lang="pug">
b-navbar-nav
  b-nav-item Incoming ({{ incoming.length }})
  b-nav-item Outgoing ({{ outgoing.length }})
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState('trusts', ['incoming', 'outgoing']),
  },
}
</script>
