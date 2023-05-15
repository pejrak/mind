<template lang="pug">
div
  b-input-group(size='sm' v-if='isAuthenticated')
    b-input-group-addon
      Button(
        disabled
        size='sm'
        :variant='isConnected ? "success" : "danger"'
      ) Connected
    b-input(
      type='text' v-model='recipientId'
    )
    b-input-group-addon
      Button(
        :disabled='!recipientId'
        @click='onMessageRecipient'
        size='sm'
      ) Message recipient
    b-input-group-addon(is-text) Me: #[strong.ml-1 {{ myConnectionId }}]
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { log } from '../../utilities/log'
import Button from '../../components/Button.vue'

const logger = log('PeerControls')

export const PeerControls = {
  components: {
    Button,
  },
  computed: {
    ...mapGetters('authentication', [
      'userEmailSnake',
      'isAuthenticated',
    ]),
    ...mapGetters('peers', [
      'isConnected',
    ]),
    ...mapState('authentication', ['userEmail']),
    ...mapState('peers', {
      myConnectionId: 'id',
    }),
  },
  data() {
    return {
      peer: null,
      recipientId: null,
    }
  },
  methods: {
    ...mapActions('peers', [
      'connectMe',
      'sendTo',
    ]),
    onMessageRecipient() {
      this.sendTo({
        recipientId: this.recipientId,
        message: `Hello from ${this.myConnectionId}!`,
      })
    },
  },
  watch: {
    isAuthenticated(v) {
      logger.info('watch: isAuthenticated', v)
      if (v) {
        this.connectMe()
      }
    },
  },
}
export default PeerControls
</script>
