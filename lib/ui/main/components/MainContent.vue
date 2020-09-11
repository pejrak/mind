<template lang="pug">
div
  b-jumbotron
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
import FragmentList from '../../fragments/components/FragmentList.vue'
import FragmentPathSelection from '../../fragmentPaths/components/FragmentPathSelection.vue'
import NewFragmentInput from '../../fragments/components/NewFragmentInput.vue'

export default {
  components: {
    FragmentList,
    FragmentPathSelection,
    NewFragmentInput,
  },
}
</script>