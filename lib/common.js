// common reusable functionality
module.exports = (function () {

  function LOG(module_name) {
    return (function() {
      var args = Array.prototype.slice.call(arguments)
      args.unshift(module_name.toUpperCase() + '(' + process.pid + '):')
      console.log.apply(null, args)
    })
  }

  // djb2
  function hashCode(str){
    var hash = 0;
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = char + (hash << 6) + (hash << 16) - hash;
    }
    return hash;
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
    LOG: LOG,
    hashCode: hashCode
  }
  
}())