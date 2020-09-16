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

    b-button-group(
      size="sm"
    )
      b-button(disabled)
        b-icon-diagram2
        span {{ pathFormatted }}
</template>

<script>
export default {
  props: ['fragment'],
  computed: {
    pathFormatted() {
      return this.fragment.path.join(' - ')
    },
  },
  methods: {
    toggleNotes() {},
    triggerForget() {},
    triggerRemoval() {},
  },
}
</script>

<style>
.offset-right {
  margin-right: .5em;
}
</style>