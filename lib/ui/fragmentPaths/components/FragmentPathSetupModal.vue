<template lang="pug">
confirmation-dialog(
  id="fragment-path-setup"
  ref="fragment-path-setup"
  title="Fragment path setup"
)
  fragment-path-setup
</template>

<script>
import ConfirmationDialog from '../../components/ConfirmationDialog.vue'
import FragmentPathSetup from './FragmentPathSetup.vue'

export default {
  components: {
    ConfirmationDialog,
    FragmentPathSetup,
  }
}
</script>