export function LOG(moduleName) {
  return function() {
    var args = Array.prototype.slice.call(arguments)
    args.unshift(moduleName.toUpperCase() + '(' + process.pid + '):')
    console.log.apply(null, args)
  }
}

export function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash)
  }
  return hash
}
