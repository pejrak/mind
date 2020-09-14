<template lang="pug">
b-input-group
  b-input-group-prepend
    b-input-group-text
      b-icon-diagram2
      span Path selection
  b-select(
    :options="availablePathOptions"
    v-model="selected"
  )
  b-btn(
    href="#"
  ) Add path
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('fragmentPaths', [
      'selectedFragmentPath'
    ]),
    ...mapGetters('fragmentPaths', [
      'availablePathOptions',
    ]),
    selected: {
      get() {
        return this.selectedFragmentPath
      },
      set(value) {
        this.selectFragmentPath(value)
      },
    }
  },
}
</script>