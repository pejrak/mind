<template lang="pug">
b-modal(
  :ref='modalReference'
  id="fragmentLoadModal"
  title="Load options"
  :ok-only="true"
)
  h3 Load from this site
  FragmentLoadOptions(@submit='closeModal')
  hr
  h3
    span
      b-icon-cloud-arrow-up
    | Import via file
  FragmentImportOptions(@submit='closeModal')
</template>

<script>
import FragmentLoadOptions from './FragmentLoadOptions.vue'
import FragmentImportOptions from './FragmentImportOptions.vue'

export default {
  components: {
    FragmentImportOptions,
    FragmentLoadOptions,
  },
  data() {
    return {
      modalReference: 'fragmentLoadModalReference',
    }
  },
  methods: {
    closeModal() {
      this.$refs[this.modalReference].hide()
    },
  },
}
</script>
