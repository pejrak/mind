<template lang="pug">
div
  FragmentImportDialog(
    :ref='fragmentImportReference'
  )
  b-button-group
    b-button(
      v-if='secretIsSet'
      variant='primary'
      @click='triggerMemorySave'
    ) Save
    b-button(
      variant='warning'
      @click='triggerMemoryImport'
    )
      b-icon-cloud-arrow-up
      | Import
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
import FragmentImportDialog from '../../fragments/components/FragmentImportDialog.vue'
export default {
  components: {
    FragmentImportDialog,
  },
  computed: {
    ...mapGetters('authentication', [
      'secretIsSet',
    ]),
    ...mapGetters('fragments', [
      'memoryIsEmpty',
    ]),
  },
  data() {
    return {
      fragmentImportReference: 'fragmentImportDialog',
    }
  },
  methods: {
    ...mapActions('fragments', [
      'save',
      'purge',
    ]),
    async triggerMemoryImport() {
      this.$refs[this.fragmentImportReference].show()
    },
    async triggerMemorySave() {
      console.info('triggerMemorySave')
      await this.save()
    },
    async triggerMemoryPurge() {
      console.info('triggerMemoryPurge')
      await this.purge()
    },
  },
}
</script>
