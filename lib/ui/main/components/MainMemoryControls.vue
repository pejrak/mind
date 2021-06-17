<template lang="pug">
b-button-group
  b-dropdown(
    variant='primary'
    split
    @click='triggerMemoryLoad'
  )
    template(#button-content)
      b-icon-cloud-download
      | Load
    b-dropdown-item-button(
      variant='primary'
      v-b-modal="`fragmentLoadModal`"
    )
      b-icon-cloud-arrow-down
      | Load options
  b-button(
    :disabled='!canSave'
    variant='success'
    @click='triggerMemorySave'
  )
    b-icon-cloud-upload
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
      'canSave',
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
      await this.load()
    },
    async triggerMemoryPurge() {
      await this.purge()
    },
    async triggerMemorySave() {
      await this.save()
    },
  },
}
</script>
