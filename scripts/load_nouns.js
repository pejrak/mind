process.on("uncaughtException", function(error) {
  console.log("uncaught error:", error)
})

start()

function start() {
  // load nouns to redis
  // npm install byline

  var fs = require('fs')
  var byline = require('byline')
  var _ = require('underscore')
  var Redis = require("redis-stream")
  var stream_client = new Redis(6379, 'localhost')
  // Following file contains words separated by new lines,
  // with spaces replaced by underscore
  var file_path = (process.argv[2] || "../data/indext.txt")
  var read_stream = byline(fs.createReadStream(file_path, { encoding: 'utf8' }))
  var write_stream = stream_client.stream()
  var count = 0
  var SET_KEY = "MIND:nouns"
  var hashcodes = []
  var code_map = {}


  // Read and record
  write_stream.pipe(Redis.es.join('\r\n'))
  read_stream.on('data', function(line) {
    // Pipe data into redis stream
    if (line && line.length > 2 && line.indexOf("_") === -1) {
      var cod = Math.abs(hashCode(line))
      var existing_dupe = code_map[cod.toString()]

      if (existing_dupe) {
        console.log(
          "FOUND hashcode collision | existing_dupe, line:",
          existing_dupe, line
        )
      }
      else {
        code_map[cod.toString()] = line
      }
      hashcodes.push(cod)
      write_stream.redis.write(Redis.parse(['sadd', SET_KEY, line]))
    }
  })

  read_stream.on('end', function() {
    write_stream.end()
  })

  // Define exit point
  write_stream.on("end", function() {
    var hashcodes_uniq = _.uniq(hashcodes)
    var hc_len = hashcodes.length
    var hc_uniq_len = hashcodes_uniq.length
    var delta = hc_len - hc_uniq_len

    console.log("count, hc_len, hc_uniq_len, delta:", count, hc_len, hc_uniq_len, delta)
    process.exit(0)
  })
  // Return callback with error on problems
  write_stream.on("error", function(error) {
    LOG("start | error:", error)
    process.exit(2)
  })
  // Count successes
  write_stream.on("data", function(data) {
    count++
  })
  // End after data added to stream
}


// sdbm
function hashCode(str){
  var hash = 0;
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = char + (hash << 6) + (hash << 16) - hash;
  }
  return hash;
}