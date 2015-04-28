

function start() {
  // load nouns to redis
  // npm install byline

  var fs = require('fs')
  var byline = require('byline')
  var Redis = require("redis-stream")
  var stream_client = new Redis(6379, 'localhost')
  // Following file contains words separated by new lines, 
  // with spaces replaced by underscore
  var file_path = (process.argv[2] || "../data/index.txt")
  var read_stream = byline(fs.createReadStream(file_path, { encoding: 'utf8' }))
  var write_stream = stream_client.stream()
  var count = 0

  // Read and record
  write_stream.pipe(Redis.es.join('\r\n'))
  read_stream.on('data', function(line) {
    // Pipe data into redis stream
    write_stream.redis.write(Redis.parse(['sadd', set_key, set_value]))
  })

  read_stream.on('end', function() {
    write_stream.end()  
  })

  // Define exit point
  write_stream.on("end", function() {
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