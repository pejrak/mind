<template lang="pug">
b-button(@click='onClick') {{ privacyLabel }}

</template>
<script>
export default {
  computed: {
    privacyLabel() {
      switch (this.fragment.privacyLevel) {
        case 0: return 'Personal'
        case 1: return 'Private'
        case 2: return 'Public'
        default: return 'Unknown'
      }
    },
  },
  methods: {
    onClick() {
      console.log('onCLick')
    },
  },
}
</script>
