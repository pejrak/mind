<template lang="pug">
b-modal(
  id="fragment-extraction-setup"
  title="Extraction setup"
  :ok-only="true"
)
  fragment-extraction-setup
</template>

<script>
import FragmentExtractionSetup from './FragmentExtractionSetup.vue'

export default {
  components: {
    FragmentExtractionSetup,
  }
}
</script>