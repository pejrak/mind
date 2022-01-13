<template lang="pug">
b-dropdown(
  :text='privacyLabel'
  :title='privacyLevelDefinition.description'
  :variant='privacyLevelDefinition.variant'
)
  b-dropdown-item(
    v-for="privacyLevel of privacyLevels"
    :active="privacyLevel.level === fragment.privacyLevel"
    :class="privacyLevel.class"
    :key="`privacy-level-selection-${privacyLevel.level}`"
    @click='onChange(privacyLevel.level)'
    :title='privacyLevel.description'
  ) {{ privacyLevel.title }}

</template>
<script>
import { mapActions } from 'vuex'
import { constants } from '../constants'

export default {
  computed: {
    privacyLevelDefinition() {
      return this.privacyLevels.find(
        p => p.level === this.fragment.privacyLevel
      )
    },
    privacyLabel() {
      return this.privacyLevelDefinition.title
    },
    privacyLevels() {
      return constants.privacyLevels.map(p => ({
        ...p,
        variant: p.level > 0 ? 'primary' : 'success',
      }))
    },
  },
  data() {
    return {
      //
    }
  },
  methods: {
    ...mapActions('fragments', ['updateFragmentPrivacyLevel']),
    onChange(value) {
      console.info('onChange::privacyLevel', value)
      this.updateFragmentPrivacyLevel({
        fragmentId: this.fragment.id,
        value,
      })
    },
  },
  props: ['fragment'],
}
</script>
