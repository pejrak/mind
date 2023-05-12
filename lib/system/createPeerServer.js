import { ExpressPeerServer } from 'peer'
import debug from 'debug'

const log = debug('mind:createPeerServer')

export const createPeerServer = (app) => {
  const peerServer = ExpressPeerServer(app, {
    debug: true,
  })

  peerServer.on('connection', (client) => {
    log('Peer connected: ' + client.getId())
  })
  peerServer.on('error', (error) => {
    log('Peer error', error)
  })
  // peerServer.on('message', (msg) => {
  //   log('Peer msg', msg)
  // })
  return peerServer
}
