import { config } from './config/index.js'
import debug from 'debug'
import ApplicationServer from './lib/server.js'

const LOG = debug('mind:app')

// Start http server listening
ApplicationServer().listen(config.port, function() {
  LOG('(' + config.name + ') application listening on port:', config.port)
})
