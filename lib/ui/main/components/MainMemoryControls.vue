<template lang="pug">
b-button-group
  a(
    hidden
    :href='exportContent'
    :ref='exportLinkRef'
    :download='exportFileName'
  ) Downloader
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
    b-dropdown-item-button(
      variant='primary'
      @click='triggerMemoryExport'
    )
      b-icon-cloud-download-fill
      | Export
  b-button(
    :disabled='!canSave'
    variant='success'
    @click='triggerMemorySave'
    :title='``'
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
import { formatTime } from '../../utilities/formatTime'

export default {
  computed: {
    ...mapGetters('authentication', [
      'isAuthenticated',
      'userEmailSnake',
    ]),
    ...mapGetters('fragments', [
      'canSave',
      'encodedRecall',
      'memoryIsEmpty',
    ]),
    exportLink() {
      return this.$refs[this.exportLinkRef]
    }
  },
  data() {
    return {
      exportContent: '#',
      exportFileName: '',
      exportLinkRef: 'exportLinkRef',
    }
  },
  methods: {
    ...mapActions('fragments', [
      'load',
      'save',
      'purge',
    ]),
    formatTime,
    async triggerMemoryExport() {
      this.exportContent = (
        `data:text/plain;charset=UTF-8,${this.encodedRecall}`
      )
      this.exportFileName = (
        `recall_${Date.now()}_${this.userEmailSnake}.txt`
      )
      this.$nextTick(() => {
        console.info('export', this.exportLink, this.userEmailSnake)
        this.exportLink.click()
      })
    },
    async triggerMemoryLoad() {
      if (this.isAuthenticated) {
        await this.load()
      }
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
