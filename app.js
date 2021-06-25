const Config = require('./config')
const LOG = require('debug')('mind:app')
const port = require('./lib/system/port')
const app = require('./lib/server')()

// Start http server listening
app.listen(app.get('port'), function() {
  LOG('(' + Config.name + ') application listening on port:', port)
})


