<template lang="pug">
div
  b-button(
    @click='triggerLoad'
    :disabled='!isLoadable'
    :variant='loadButtonVariant'
  ) Load
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('authentication', [
      'isAuthenticated',
    ]),
    isLoadable() {
      return (this.isAuthenticated)
    },
    loadButtonVariant() {
      return this.isLoadable
        ? 'success'
        : 'danger'
    }
  },
  methods: {
    ...mapActions('fragments', [
      'load',
    ]),
    async triggerLoad() {
      const success = await this.load()
      if (success) this.$emit('submit')
    },
  },
}
</script>
