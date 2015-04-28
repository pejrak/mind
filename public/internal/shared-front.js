var MIND = (function() {
  var current_user
  var mem_pointer = "mind_snapshot"
  var cache = {}

  function checkCurrentUser() {
    current_user_data = $("body").attr("data-user")
    if (current_user_data && current_user_data !== "none") {
      current_user = current_user_data
    }
    Memory.owner = current_user
  }

  function notify(message, options) {
    options = options || {}
    if (message && message.length) {
      var fadeout_delay = options.delay || 3000
      var notification_id = options.id || "notification_" + Date.now()
      var content = render("notification_tmpl", {
            id: notification_id,
            message: message
          })

      $("#notifications").append(content)
      setTimeout(function() {
        $("#" + notification_id).fadeOut(1000).remove()
      }, fadeout_delay)
    }
  }

  function fDate(date_int) {
    var date = new Date(date_int || Date.now())
    var hour = ("0" + date.getHours()).slice(-2)
    var minute = ("0" + date.getMinutes()).slice(-2)
    var month = ("0" + (date.getMonth() + 1)).slice(-2)
    var day = ("0" + date.getDate()).slice(-2)
    var year = date.getFullYear()

    return (
      hour + ":" + minute + ", " + day + "-" + month + "-" + year
    )
  }


  var Memory = (function() {

    var LIMITS = {
      fragment_len: [2, 1000],
      enc_pwd_len: [2, 100]
    }
    var BASIC_PATHS = [["temporary"]]
    var validate = {
      fragment: function(text) {
        var passing = (
              typeof(text) === "string" && 
              text.length > LIMITS.fragment_len[0] && 
              text.length < LIMITS.fragment_len[1]
            )
        return {
          pass: passing,
          message: (
            "Submittal needs to be between " + 
              LIMITS.fragment_len[0] + " and " + LIMITS.fragment_len[1] + " " +
            "characters."
          )
        }
      },
      path: function(path) {
        return {
          pass: (
            path instanceof Array && path.length
          ),
          message: "Path assignment invalid."
        }
      },
      memory: function(text, path) {
        //TODO: var existing_in_path = []
        return {
          pass: true,
          message: "Text must be unique in path."
        }
      }
    }    
    var fragments = []

    function Fragment(options) {
      var text = options.text
      var path = options.path
      var now = Date.now()
      var created_at = options.created_at || now
      var updated_at = options.updated_at || now
      var id = options.id || now
      var owner = options.owner || MIND.Memory.owner

      return {
        id: id,
        text: text,
        created_at: created_at,
        created_at_f: fDate(created_at),
        updated_at: updated_at,
        updated_at_f: fDate(updated_at),
        path: path,
        owner: owner,
      }
    }

    function merge(fragment) {
      fragments.push(fragment)
      // Add to index for searching
      MIND.index.add({
        id: fragment.id,
        path: fragment.path.join(" "),
        text: fragment.text
      })
    } 

    function add(text, path) {
      var validation_errors = []
      var text_valid = validate.fragment(text)
      var path_valid = validate.path(path)
      var mem_valid = validate.memory(text, path)
      var validations = [text_valid, path_valid, mem_valid]
      var is_valid = true

      validations.forEach(function(validation) {
        if (!validation.pass) {
          validation_errors.push(validation.message)
          is_valid = false
        }
      })
      // Check validity of the fragment
      if (is_valid) {
        merge(Fragment({ text: text, path: path }))
        return {
          success: true
        }
      }
      else {
        return {
          validation_errors: validation_errors
        }
      }
    }

    return {
      add: add,
      merge: merge,
      fragments: fragments,
      on_display: [],
      on_path: [],
      initiated_at: Date.now(),
      initiated_at_f: fDate(),
      owner: current_user,
      LIMITS: LIMITS,
      BASIC_PATHS: BASIC_PATHS,
      paths: BASIC_PATHS.slice(0)
    }
  } ())
  
  function saveMemorySnapshot() {
    var mem_len = Memory.fragments.length

    if (mem_len) {
      MIND.log("saveMemorySnapshot | mem_len:", mem_len)
      localStorage.setItem(mem_pointer, JSON.stringify({
        fragments: Memory.fragments,
        initiated_at: Memory.initiated_at,
        owner: current_user
      }))
    }
  }

  function clean() {
    var now = Date.now()

    Memory.fragments = []
    Memory.on_path = []
    Memory.on_display = []
    Memory.initiated_at = now
    Memory.initiated_at_f = fDate(now)
    Memory.paths = Memory.BASIC_PATHS.slice(0)
    localStorage.removeItem(mem_pointer)
  }

  function loadMemorySnapshot() {
    var snapshot_str = localStorage.getItem(mem_pointer)

    MIND.log("loadMemorySnapshot | snapshot_str:", snapshot_str)
    if (
      snapshot_str && typeof(snapshot_str) === "string" && 
      snapshot_str.length
    ) {
      var snapshot
      var parsing_error
      try {
        snapshot = JSON.parse(snapshot_str)
      }
      catch (error) {
        parsing_error = error
      }
      finally {
        if (snapshot && snapshot.fragments) {
          snapshot.fragments.forEach(function(fragment) {
            Memory.merge(fragment)
          })
          Memory.initiated_at = snapshot.initiated_at
          Memory.initiated_at_f = fDate(Memory.initiated_at)
          MIND.log("snapshot:", snapshot)
          notify("Loaded memory from local store.")

        }
        else {
          notify("Unable to load local storage. " + (
            parsing_error ? "Memory is corrupt." : ""))
        }
      }
    }
  }

  function log() {
    var log_enabled = (
          $("#content").attr("data-system-environment") === "development"
        )
    if (log_enabled) console.log(arguments);
  }

  // Custom function for firing off delayed function execution with custom timer
  function timeIt(execFunction, delay) {
    // Set custom timer name, if function does not have a name, it will be just
    // the appended string
    var timer_name = execFunction.name + "_delayed_timer"
    // Set default to 350 ms, which seems to be a good starting point
    delay = (delay || 350)
    // Clear previous timer if one is set
    if (cache[timer_name]) {
      clearTimeout(cache[timer_name])
    }
    // Now start a new timer
    cache[timer_name] = setTimeout(execFunction, delay)
  }  


  // Simple JavaScript Templating
  // John Resig - http://ejohn.org/ - MIT Licensed
  var tmpl_cache = {}
  var render = function render(str, data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str) ?
      tmpl_cache[str] = tmpl_cache[str] ||
        render(document.getElementById(str).innerHTML) :
     
      // Generate a reusable function that will serve as a template
      // generator (and which will be cached).
      new Function("obj",
        "var p=[],print=function(){p.push.apply(p,arguments);};" +
       
        // Introduce the data as local variables using with(){}
        "with(obj){p.push('" +
       
        // Convert the template into pure JavaScript
        str
          .replace(/[\r\t\n]/g, " ")
          .split("{").join("\t")
          .replace(/((^|\})[^\t]*)'/g, "$1\r")
          .replace(/\t\$(.*?)\}/g, "',$1,'")
          .split("\t").join("');")
          .split("}").join("p.push('")
          .split("\r").join("\\'")
      + "');}return p.join('');")
    // Provide some basic currying to the user

    return (data ? fn(data) : fn)
  }

  function capLead(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }


  return {
    render: render,
    clean: clean,
    log: log,
    notify: notify,
    timeIt: timeIt,
    capLead: capLead,
    Memory: Memory,
    loadMemorySnapshot: loadMemorySnapshot,
    saveMemorySnapshot: saveMemorySnapshot,
    checkCurrentUser: checkCurrentUser
  }
} ())

