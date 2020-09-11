// common reusable functionality

exports.LOG = function LOG(module_name) {
  return (function() {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(module_name.toUpperCase() + '(' + process.pid + '):')
    console.log.apply(null, args)
  })
}

exports.hashCode = function hashCode(str){
  var hash = 0
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i)
    hash = (char + (hash << 6) + (hash << 16) - hash)
  }
  return hash
}

exports.transforms = {
  string: val => `${val}`,
  integer: val => parseInt(val),
  float: val => parseFloat(val),
}
