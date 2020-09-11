<template lang="pug">
div
  b-button-toolbar
    b-button-group(
      size='sm'
    )
      b-button
        b-icon-bookmark-dash
        span Forget
      b-button
        b-icon-trash
        span Remove
      b-button
        b-icon-journal
        span Notes

    b-button-group.offset-left(
      size='sm'
    )
      b-button
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
}
</script>

<style>
.offset-left {
  margin-left: 1em;
}
</style>