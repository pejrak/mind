<template lang="pug">
b-modal(
  id="fragmentExtractionSetupModal"
  title="Extraction setup"
  :ok-only="true"
)
  FragmentExtractionSetup
</template>

<script>
import FragmentExtractionSetup from './FragmentExtractionSetup.vue'

export default {
  components: {
    FragmentExtractionSetup,
  }
}
</script>
