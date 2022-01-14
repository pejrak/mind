import { PeerServer } from 'peer'
import { config } from '../../config/index.js'

export const createPeerServer = () => PeerServer({
  host: config.peerServerHost || 'localhost',
  port: config.peerServerPort,
  path: '/peer',
})
