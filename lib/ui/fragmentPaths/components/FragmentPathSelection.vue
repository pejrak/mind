<template lang="pug">
div
  ConfirmationDialog(
    ref="fragment-path-setup"
    title="Fragment path setup"
    :confirmationMessage="false"
    dialogTitle="New path"
    confirmTitle="Close"
    :confirmOnly="true"
  )
    FragmentPathSetup(
      @submitted="triggerSetupDialogExit"
    )
  b-input-group.offset-left
    b-input-group-prepend
      b-input-group-text
        b-icon-diagram2
        span Path ({{ availablePathOptions.length }})
    b-dropdown(
      :text='selectedFragmentPathName'
    )
      b-dropdown-item-button(
        v-for='pathOption in availablePathOptions'
        :key='`fragment-path-option-${pathOption.value}`'
        @click='selectFragmentPath(pathOption.value)'
      )
        b-icon-diagram2
        | {{ pathOption.text }}
      b-dropdown-item-button.add-path-button(
        @click="toggleFragmentPathSetup"
      )
        b-icon-record
        b Add a path
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import FragmentPathSetup from './FragmentPathSetup.vue'
import ConfirmationDialog from '../../components/ConfirmationDialog.vue'
import { log } from '../../utilities/log'

const logger = log('FragmentPathSelection')

export default {
  components: {
    ConfirmationDialog,
    FragmentPathSetup,
  },
  computed: {
    ...mapState('fragmentPaths', [
      'selectedFragmentPath'
    ]),
    ...mapGetters('fragmentPaths', [
      'availablePathOptions',
      'selectedFragmentPathName',
    ]),
    dialog() {
      return this.$refs['fragment-path-setup']
    },
    selected: {
      get() {
        return this.selectedFragmentPathName
      },
      set(value) {
        this.selectFragmentPath(value)
      },
    }
  },
  methods: {
    ...mapActions('fragmentPaths', [
      'selectFragmentPath',
    ]),
    toggleFragmentPathSetup() {
      this.dialog.show().onConfirm(() => {
        logger.info('confirmed fragment path')
      })
    },
    triggerSetupDialogExit() {
      this.dialog.hide()
    }
  },
  mounted() {
    logger.info('mounted')
    this.selectFragmentPath(this.selected)
  }
}
</script>
