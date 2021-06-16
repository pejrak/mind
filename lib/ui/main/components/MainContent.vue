<template lang="pug">
div
  FragmentLoadModal
  b-button(
    v-if='!showNewFragmentForm'
    block
    @click='showNewFragmentForm = true'
  ) Add memory
  b-collapse(
    v-model="showNewFragmentForm"
  )
    b-jumbotron.main-jumbotron
      NewFragmentInput
      .float-right
        b-button(
          @click='showNewFragmentForm = false'
        )
          b-icon-eye-slash
          span Hide
      .spacer
  FragmentList
</template>

<script>
// import FragmentExtractionModal from '../../fragments/components/FragmentExtractionModal.vue'
import FragmentLoadModal from '../../fragments/components/FragmentLoadModal.vue'
import FragmentList from '../../fragments/components/FragmentList.vue'
import NewFragmentInput from '../../fragments/components/NewFragmentInput.vue'

export default {
  components: {
    // FragmentExtractionModal,
    FragmentList,
    FragmentLoadModal,
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
