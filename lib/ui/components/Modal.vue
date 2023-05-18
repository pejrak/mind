<template lang="pug">
div
  b-modal(
    :id='id'
    :ref='id'
    :title='title'
    ok-only=true
    ok-variant='secondary'
    ok-title='Close'
    :size='size'
    @close='$emit("close")'
    @hide='$emit("close")'
    @show='$emit("show")'
  )
    slot
</template>
<script>
import { log } from '../utilities/log'
const logger = log('Components:Modal')
export const Modal = {
  computed: {
    modal() {
      return this.$refs[this.id]
    },
  },
  methods: {
    hide() {
      logger.info('hide')
      return this.modal.hide()
    },
    show() {
      logger.info('show')
      return this.modal.show()
    },
  },
  props: {
    id: String,
    size: {
      default: 'lg',
      type: String,
    },
    title: {
      default: 'Modal',
      type: String,
    },
  },
}

export default Modal
</script>
