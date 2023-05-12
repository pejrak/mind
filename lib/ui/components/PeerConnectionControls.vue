<template lang="pug">
div
  b-input-group(size='sm' v-if='isAuthenticated')
    b-input-group-addon
      Button(
        :disabled='isConnected'
        @click='onConnect'
        size='sm'
      ).text-primary Connect mind
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
import { mapGetters, mapState } from 'vuex'
import { log } from '../utilities/log'
import Button from './Button.vue'
import { Peer } from 'peerjs'
import { getPeerConnectionId } from '../utilities/getPeerConnectionId'

const logger = log('PeerConnectionControls')

export const PeerConnectionControls = {
  components: {
    Button,
  },
  computed: {
    ...mapGetters('authentication', [
      'userEmailSnake',
      'isAuthenticated',
    ]),
    ...mapState('authentication', ['userEmail']),
    isConnected() {
      return !!this.peer
    },
    myConnectionId() {
      logger.info('myConnectionId', this.userEmail)
      return getPeerConnectionId(this.userEmail)
    },
  },
  data() {
    return {
      peer: null,
      recipientId: null,
    }
  },
  methods: {
    onConnect() {
      // this.$peer.connect()
      this.peer = new Peer(this.myConnectionId, {
        // debug: 3,
        host: 'localhost',
        port: 3000,
        path: '/peerjs',
      })

      this.peer.on('open', (id) => {
        logger.info('open', id)
      })
      this.peer.on('error', (error) => {
        logger.warn('error', error)
      })

      this.peer.on('connection', (conn) => {
        conn.on('data', (data) => {
          logger.info(`received: ${data}`, conn)
        })
      })
    },
    onMessageRecipient() {
      const conn = this.peer.connect(this.recipientId)
      conn.on('open', () => conn.send(`Hello from ${this.myConnectionId}!`))
      conn.on('data', (data) => logger.info(`received`, data))
    },
  },
  mounted() {},
}
export default PeerConnectionControls
</script>
