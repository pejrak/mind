// common reusable functionality
module.exports = (function () {

  function LOG(module_name) {
    return (function() {
      var args = Array.prototype.slice.call(arguments)
      args.unshift(module_name.toUpperCase() + '(' + process.pid + '):')
      console.log.apply(null, args)
    })
  }

  var transforms = {
    string: function(val) {
      return val.toString()
    },
    integer: function(val) {
      return parseInt(val)
    },
    float: function(val) {
      return parseFloat(val)
    }
  }

  return {
    transforms: transforms,
    LOG: LOG
  }
  
}())