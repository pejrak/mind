<template lang="pug">
div
  b-button-group
    b-button(
      variant='primary'
      v-b-modal="`fragmentLoadModal`"
    )
      b-icon-cloud-arrow-up
      | Load
    b-button(
      variant='primary'
      @click='triggerMemorySave'
    )
      b-icon-cloud-arrow-down
      | Save
    b-button(
      :disabled='memoryIsEmpty'
      variant='danger'
      @click='triggerMemoryPurge'
    )
      b-icon-cloud-slash
      | Clear
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('fragments', [
      'memoryIsEmpty',
    ]),
  },
  methods: {
    ...mapActions('fragments', [
      'save',
      'purge',
    ]),
    async triggerMemoryLoad() {
      console.info('triggerMemoryLoad')
    },
    async triggerMemoryPurge() {
      const success = await this.purge()
      console.info('triggerMemoryPurge', success)
      return success
    },
    async triggerMemorySave() {
      console.info('triggerMemorySave')
      await this.save()
    },
  },
}
</script>
