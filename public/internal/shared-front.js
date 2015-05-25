var MIND = (function() {
  var current_user
  var mem_pointer = "mind_snapshot"
  var cache = {}

  function checkCurrentUser() {
    current_user_data = $("body").attr("data-user")
    if (current_user_data && current_user_data !== "none") {
      current_user = current_user_data
    }
    MIND.current_user = current_user
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
      fragment_len: [2, 5000],
      enc_pwd_len: [2, 100]
    }
    var fragments = []
    var BASIC_PATHS = [["temporary"]]
    var initiated_at = Date.now()
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
        memorized: true,
        owner: owner
      }
    }

    function fragmentIsUnique(fragment) {
      var duplicates = fragments.filter(function(compared) {
        return (compared.id === fragment.id)
      })
      return (duplicates.length === 0)
    }

    function merge(fragment, source) {
      if (fragmentIsUnique(fragment)) {
        if (source && (
            !fragment.load_source || fragment.load_source !== source
          )
        ) {
          fragment.load_source = source
        }
        fragments.push(fragment)
        // Add to index for searching
        MIND.index.add({
          id: fragment.id,
          path: fragment.path.join(" "),
          text: fragment.text
        })
      }
      else {
        fragment.duplicate = true
        MIND.log("duplicate fragment:", fragment)
      }
     }

    function recall(source, filter) {
      var extraction = {
            initiated_at: initiated_at,
            extracted_at: Date.now(),
            paths: Memory.paths,
            owner: current_user,
            source: (source || "local")
          }

      if (filter) {
        // We will be filtering here
      }
      else {
        extraction.fragments = fragments
      }

      return extraction
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
        merge(Fragment({ text: text, path: path }), "local")
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
      recall: recall,
      fragments: fragments,
      on_display: [],
      on_path: [],
      initiated_at: initiated_at,
      initiated_at_f: fDate(initiated_at),
      owner: current_user,
      LIMITS: LIMITS,
      BASIC_PATHS: BASIC_PATHS,
      paths: BASIC_PATHS.slice(0)
    }
  } ())

  function addPath(path) {
    var current_path_dupes = Memory.paths.filter(function(path_rec) {
      var comparison = comparePaths(path_rec, path)
      
      return (
        comparison.diff_right.length === 0 && comparison.diff_left.length === 0
      )
    })

    MIND.log("addPath | path:", path)
    return (current_path_dupes.length ? false : Memory.paths.push(path))
  }


  function saveMemorySnapshot() {
    var mem_len = Memory.fragments.length

    if (mem_len) {
      MIND.log("saveMemorySnapshot | mem_len:", mem_len)
      localStorage.setItem(mem_pointer, JSON.stringify(Memory.recall()))
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

  function checkStructure(content) {
    var parsed_content
    var parsing_error
    var is_encrypted

    if (
      content && typeof(content) === "string" && 
      content.length
    ) {
      try {
        parsed_content = JSON.parse(content)
      }
      catch (error) {
        parsing_error = error
      }
      finally {
        is_encrypted = (
          parsed_content && typeof(parsed_content) === "object" &&
          parsed_content.hasOwnProperty("cipher") && 
          parsed_content.hasOwnProperty("ct")
        );
      }
    }
    return {
      parsing_error: parsing_error,
      parsed_content: parsed_content,
      is_encrypted: is_encrypted
    }
  }

  function loadMemorySnapshot(provided_str) {
    var snapshot_str = provided_str || localStorage.getItem(mem_pointer)

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
        if (validSnapshot(snapshot)) {
          mergeMemory(snapshot)
        }
        else {
          notify("Unable to load memory. " + (
            parsing_error ? "Memory is corrupt." : ""))
        }
      }
    }
  }

  function validSnapshot(snapshot) {
    return (
      snapshot && typeof(snapshot) === "object" && 
      snapshot.fragments && snapshot.fragments.length
    )
  }

  function comparePaths(child_path, parent_path) {
    return {
      diff_right: $(parent_path).not(child_path).get(),
      diff_left: $(child_path).not(parent_path).get()
    }
  }  

  function mergeMemory(snapshot, source) {
    var source = (source || snapshot.source || "local")

    snapshot.fragments.forEach(function(fragment) {
      Memory.merge(fragment, source)
    })

    snapshot.paths.forEach(addPath)
    Memory.initiated_at = snapshot.initiated_at
    Memory.initiated_at_f = fDate(Memory.initiated_at)
    saveMemorySnapshot()
  }

  function log() {
    var log_enabled = (
          $("#content").attr("data-system-environment") === "development"
        )

    if (log_enabled) {
      var args = Array.prototype.slice.call(arguments)
      console.log(args)
    }
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
       
        // Convert the template into pure J[1:23:57 PM] Matthew Perkins: so conneccted vpn to HK and it worksavaScript
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

  // Base 64 enc, got from 
  // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa#Unicode_Strings
  function toBase(str) {
      return window.btoa(unescape(encodeURIComponent(str)));
  }

  function fromBase(str) {
      return decodeURIComponent(escape(window.atob(str)));
  }


  return {
    render: render,
    clean: clean,
    log: log,
    notify: notify,
    timeIt: timeIt,
    capLead: capLead,
    toBase: toBase,
    fromBase: fromBase,
    Memory: Memory,
    addPath: addPath,
    current_user: current_user,
    checkStructure: checkStructure,
    comparePaths: comparePaths,
    loadMemorySnapshot: loadMemorySnapshot,
    mergeMemory: mergeMemory,
    validSnapshot: validSnapshot,
    saveMemorySnapshot: saveMemorySnapshot,
    checkCurrentUser: checkCurrentUser
  }
} ())

