process.on('uncaughtException', function(error) {
  console.log('uncaught error:', error)
})

start()

function start() {
  // load nouns to redis
  // npm install byline

  var fs = require('fs')
  var byline = require('byline')
  var _ = require('underscore')
  var Redis = require('redis-stream')
  var streamClient = new Redis(6379, 'localhost')
  // Following file contains words separated by new lines,
  // with spaces replaced by underscore
  var filePath = (process.argv[2] || '../data/indext.txt')
  var readStream = byline(fs.createReadStream(filePath, { encoding: 'utf8' }))
  var writeStream = streamClient.stream()
  var count = 0
  var SET_KEY = 'MIND:nouns'
  var hashcodes = []
  var codeMap = {}

  // Read and record
  writeStream.pipe(Redis.es.join('\r\n'))
  readStream.on('data', function(line) {
    // Pipe data into redis stream
    if (line && line.length > 2 && line.indexOf('_') === -1) {
      var cod = Math.abs(hashCode(line))
      var existingDuplicate = codeMap[cod.toString()]

      if (existingDuplicate) {
        console.log(
          'FOUND hashcode collision | existingDuplicate, line:',
          existingDuplicate, line
        )
      } else {
        codeMap[cod.toString()] = line
      }
      hashcodes.push(cod)
      writeStream.redis.write(Redis.parse(['sadd', SET_KEY, line]))
    }
  })

  readStream.on('end', function() {
    writeStream.end()
  })

  // Define exit point
  writeStream.on('end', function() {
    var hashCodesUniq = _.uniq(hashcodes)
    var hashCodesLen = hashcodes.length
    var hashCodesUniqLen = hashCodesUniq.length
    var delta = hashCodesLen - hashCodesUniqLen

    console.log('count, hashCodesLen, hashCodesUniqLen, delta:', count, hashCodesLen, hashCodesUniqLen, delta)
    process.exit(0)
  })
  // Return callback with error on problems
  writeStream.on('error', function(error) {
    console.log('start | error:', error)
    process.exit(2)
  })
  // Count successes
  writeStream.on('data', function(data) {
    count++
  })
  // End after data added to stream
}

// sdbm
function hashCode(str) {
  var hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = char + (hash << 6) + (hash << 16) - hash
  }
  return hash
}
