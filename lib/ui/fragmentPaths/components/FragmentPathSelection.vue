<template lang="pug">
div
  confirmation-dialog(
    ref="fragment-path-setup"
    title="Fragment path setup"
    :confirmationMessage="false"
    dialogTitle="New path"
    confirmTitle="Close"
    :confirmOnly="true"
  )
    fragment-path-setup(
      @submitted="triggerSetupDialogExit"
    )
  b-input-group.offset-left
    b-input-group-prepend
      b-input-group-text
        b-icon-diagram2
        span Path selection
    b-select(
      :options="availablePathOptions"
      v-model="selected"
    )
    b-btn(
      @click="toggleFragmentPathSetup"
  ) Add path
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
import FragmentPathSetup from './FragmentPathSetup.vue'
import ConfirmationDialog from '../../components/ConfirmationDialog.vue'
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
    ...mapMutations('fragmentPaths', [
      'selectFragmentPath',
    ]),
    toggleFragmentPathSetup() {
      this.dialog.show().onConfirm(() => {
        console.log('confirmed fragment path')
      })
    },
    triggerSetupDialogExit() {
      this.dialog.hide()
    }
  },
}
</script>
