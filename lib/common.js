// common reusable functionality
module.exports = (function () {

  function LOG(module_name) {
    return (function() {
      var args = Array.prototype.slice.call(arguments)
      args.unshift(module_name.toUpperCase() + '(' + process.pid + '):')
      console.log.apply(null, args)
    })
  }

  return {
    LOG: LOG
  }
  
}())