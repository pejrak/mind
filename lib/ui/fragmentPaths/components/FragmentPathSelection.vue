<template lang="pug">
b-input-group(prepend="Path selection")
  b-select(
    :options="availablePathOptions"
    v-model="selected"
  )
  b-btn(
    href="#"
  ) Add
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