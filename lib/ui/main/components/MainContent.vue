<template lang="pug">
div.pb-5
  FragmentLoadModal
  Button(
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
        Button(
          @click='showNewFragmentForm = false'
        )
          b-icon-eye-slash
          span Hide
      .spacer
  FragmentPathContent
    FragmentList
</template>

<script>
// import FragmentExtractionModal from '../../fragments/components/FragmentExtractionModal.vue'
import FragmentLoadModal from '../../fragments/components/FragmentLoadModal.vue'
import FragmentList from '../../fragments/components/FragmentList.vue'
import NewFragmentInput from '../../fragments/components/NewFragmentInput.vue'
import FragmentPathContent from '../../fragmentPaths/components/FragmentPathContent.vue'
import { Button } from '../../components/Button.vue'

export default {
  components: {
    // FragmentExtractionModal,
    Button,
    FragmentList,
    FragmentLoadModal,
    FragmentPathContent,
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
