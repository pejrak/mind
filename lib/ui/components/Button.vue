<template lang="pug">
b-button(
  :block='block'
  :disabled='busy || disabled'
  :href='href'
  :variant='variant'
  @click="onClick"
  :size='size'
  :target='target'
  :title='title'
)
  span(v-if='busy') #[b-spinner.mr-1(small)] {{ busyLabel }}
  slot(v-else)
</template>
<script>
export const Button = {
  methods: {
    onClick() {
      if (this.confirm) {
        const confirmed = confirm(
          typeof this.confirm === 'string'
            ? this.confirm
            : 'Are you sure?',
        )
        if (!confirmed) {
          return
        }
      }
      this.$emit('click')
    },
  },
  props: {
    block: {
      type: Boolean,
      default: false,
    },
    busy: {
      type: Boolean,
      default: false,
    },
    busyLabel: {
      type: String,
      default: '...',
    },
    confirm: {
      type: String | Boolean,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    href: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: 'md',
    },
    target: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: 'Button',
    },
    variant: {
      type: String,
      default: 'secondary',
    },
  },
}

export default Button
</script>
