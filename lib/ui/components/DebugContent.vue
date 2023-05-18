<template lang="pug">
span(
  v-if='environment === "development"'
)
  Modal(
    :ref='modalIdReference'
    :id='modalId'
    title='Debug content'
  )
    slot
  Button.my-1(
    @click='onShowDebugContent'
    size='sm'
    variant='outline-dark'
  )
    b-icon-alt
</template>

<script>
import { environment } from '../constants'
import { Button } from './Button.vue'
import { Modal } from './Modal.vue'

export const DebugContent = {
  components: {
    Button,
    Modal,
  },
  computed: {
    environment() {
      return environment
    },
    modalIdReference() {
      return `modal-id-${this.modalId}`
    },
  },
  methods: {
    onShowDebugContent() {
      this.$refs[this.modalIdReference].show()
    },
  },
  props: {
    modalId: {
      default: 'debug-content',
      type: String,
    },
  },
}

export default DebugContent
</script>
