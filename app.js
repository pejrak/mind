import { config } from './config/index.js'
import debug from 'debug'
import ApplicationServer from './lib/server.js'
import { createPeerServer } from './lib/system/createPeerServer.js'

const LOG = debug('mind:app')

// Start http server listening
const app = ApplicationServer()
const listener = app.listen(config.port, function() {
  LOG('(' + config.name + ') application listening on port:', config.port)
  app.use('/peerjs', createPeerServer(listener))
})
