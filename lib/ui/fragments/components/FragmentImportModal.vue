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
import { decode } from 'js-base64'

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
        content = JSON.parse(decode(payload))
      } catch (error) {
        console.error('Error when parsing import file:', error)
      }

      return content
    },
    triggerImport() {
      if (this.importFilePath) {
        const reader = new FileReader()
        reader.onload = event => {
          const content = this.parseImportContent(event.target.result)
          const importIsValid = fragmentsImportValid(content)
          if (importIsValid) {
            this.merge(content)
          }
        }
        reader.readAsText(this.importFilePath)
      }
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
