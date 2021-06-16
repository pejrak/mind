<template lang="pug">
b-button-group
  b-dropdown(
    split
    @click='triggerMemoryLoad'
    text='Load'
  )
    b-dropdown-item-button(
      variant='primary'
      v-b-modal="`fragmentLoadModal`"
    )
      b-icon-cloud-arrow-up
      | Load options
  b-button(
    variant='success'
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
      'load',
      'save',
      'purge',
    ]),
    async triggerMemoryLoad() {
      const success = await this.load()
      console.info('triggerMemoryLoad', success)
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
