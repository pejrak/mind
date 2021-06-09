<template lang="pug">
div
  ConfirmationDialog(
    :ref='componentRef'
    :dialogRef='confirmationDialogRef'
    dialogTitle='Select file to import'
    :confirmationMessage='false'
    confirmOnly=false
    confirmTitle='Import selected file'
  )
    b-input-group
      b-input-group-prepend
        b-input-group-text
          b-icon-file-arrow-up
      b-form-file(
        v-model='importFilePath'
      )
</template>
<script>
import { mapActions } from 'vuex'
import ConfirmationDialog from '../../components/ConfirmationDialog.vue'
import { fragmentsImportValid } from '../fragmentsImportValid'

export default {
  components: {
    ConfirmationDialog,
  },
  data() {
    return {
      componentRef: 'fragmentImportComponentReference',
      confirmationDialogRef: 'fragmentImportConfirmationDialog',
      importFilePath: null,
    }
  },
  methods: {
    ...mapActions('fragments', [
      'merge',
    ]),
    parseImportContent(payload) {
      let content
      try {
        content = JSON.parse(payload)
      } catch (error) {
        console.error('Error when parsing import file:', error)
      }

      console.info('parsed content', content)
      return content
    },
    triggerImport() {
      if (this.importFilePath) {
        const reader = new FileReader()
        reader.onload = event => {
          const content = this.parseImportContent(event.target.result)
          const importIsValid = fragmentsImportValid(content)
          console.info('loaded file content', content, importIsValid)
          if (importIsValid) {
            this.merge(content)
          }
        }
        reader.readAsText(this.importFilePath)
      } else {
        console.info('No import file was selected.')
      }
      console.info('import confirmed', this.importFilePath)
      this.$emit('submit', this.importFilePath)
    },
    show() {
      this.$refs[this.componentRef].show().onConfirm(
        () => this.triggerImport()
      )
    },
  },
}
</script>
