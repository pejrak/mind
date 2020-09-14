<template lang="pug">
div
  fragment-extraction-modal
  b-collapse(
    v-model="showNewFragmentForm"
  )
    b-jumbotron.main-jumbotron
      b-row
        b-col(cols="2")
        b-col
          fragment-path-selection
        b-col(cols="2")
      br
      new-fragment-input
  fragment-list
</template>

<script>
import FragmentExtractionModal from '../../fragments/components/FragmentExtractionModal.vue'
import FragmentList from '../../fragments/components/FragmentList.vue'
import FragmentPathSelection from '../../fragmentPaths/components/FragmentPathSelection.vue'
import NewFragmentInput from '../../fragments/components/NewFragmentInput.vue'

export default {
  components: {
    FragmentExtractionModal,
    FragmentList,
    FragmentPathSelection,
    NewFragmentInput,
  },
  data() {
    return {
      showNewFragmentForm: false
    }
  },
}
</script>
<style>
.jumbotron.main-jumbotron {
  padding-top: 4em;
  padding-bottom: 2em;
}
</style>