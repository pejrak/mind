<template lang="pug">
div
  b-button-toolbar
    b-button-group.offset-right(
      size="sm"
    )
      b-button(@click="triggerForget")
        b-icon-bookmark-dash
        span Forget
      b-button(@click="triggerRemoval")
        b-icon-trash
        span Remove
      b-button(@click="toggleNotes")
        b-icon-journal
        span Notes
          span(
            v-if='fragment.notes.length'
          )  ({{ fragment.notes.length }})

    b-button-group(
      size="sm"
    )
      b-button(disabled)
        b-icon-diagram2
        span {{ pathFormatted }}
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  props: ['fragment'],
  computed: {
    pathFormatted() {
      return this.fragment.path.join(' - ')
    },
  },
  methods: {
    ...mapActions('fragments', [
      'forgetFragment'
    ]),
    ...mapMutations('fragments', [
      'showNotes'
    ]),
    toggleNotes() {
      this.showNotes(this.fragment.id)
    },
    triggerForget() {
      this.forgetFragment(this.fragment.id)
    },
    triggerRemoval() {},
  },
}
</script>

<style>
.offset-right {
  margin-right: .5em;
}
</style>