<template lang="pug">
div
  b-form-textarea(
    v-model="textInput"
    placeholder="... text ..."
    :state="newFragmentTextState"
  )
  br
  b-button(
    :disabled="!newFragmentTextIsValid"
    variant="primary"
    @click="submitFragment"
  ) Submit
</template>
<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('fragments', [
      'newFragmentText'
    ]),
    ...mapGetters('fragments', [
      'newFragmentTextIsEmpty',
      'newFragmentTextIsValid',
    ]),
    newFragmentTextState() {
      return this.newFragmentTextIsEmpty
        ? null
        : this.newFragmentTextIsValid
    },
    textInput: {
      get() {
        return this.newFragmentText
      },
      set(value) {
        this.setNewFragmentText(value)
      }
    }
  },
  methods: {
    ...mapMutations('fragments', [
      'setNewFragmentText',
    ]),
    ...mapActions('fragments', [
      'submitNewFragment',
    ]),
    async submitFragment() {
      this.submitNewFragment()
    }
  }
}
</script>
