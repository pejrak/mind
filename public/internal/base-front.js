var MIND = (function() {
  var current_user = "none"
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
    var LIMITS        = {
      fragment_len: [2, 5000],
      enc_pwd_len: [2, 100],
      note_len: [2, 1000]
    }
    var DEFS          = {
      fragment: {
        id: {
          type: "integer",
          exports: true
        },
        text: {
          type: "string",
          exports: true
        },
        owner: {
          type: "string",
          exports: true
        },
        memorized: {
          type: "boolean",
          exports: true
        },
        created_at: {
          type: "integer",
          exports: true
        },
        updatedAt: {
          type: "integer",
          exports: true
        },
        path: {
          type: "array",
          exports: true
        },
        notes: {
          type: "array",
          exports: true
        }
      }
    }
    var BASIC_PATHS   = [["temporary"]]
    var fragments     = []
    var removed       = []
    var initiated_at  = Date.now()
    var validate      = {
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
      },
      note: function(note) {
        var note_len = (note.text || "").length
        MIND.log("validate | note:", note)
        return {
          pass: (
            note.parent_id > 0 &&
            note_len > LIMITS.note_len[0] &&
            note_len < LIMITS.note_len[1]
          ),
          message: "Invalid note submitted."
        }
      }
    }

    function Fragment(options) {
      var text        = options.text
      var path        = options.path
      var now         = Date.now()
      var created_at  = options.created_at || now
      var updatedAt  = options.updatedAt || now
      var id          = options.id || now
      var owner       = options.owner || MIND.Memory.owner
      var notes       = options.notes || []

      return {
        id,
        text,
        created_at,
        updatedAt,
        path,
        notes,
        memorized: true,
        owner,
      }
    }

    function fragmentIsUnique(fragment) {
      var duplicates = fragments.filter(function(compared) {
        return (compared.id === fragment.id)
      })
      return (duplicates.length === 0)
    }

    function cleanFragment(original) {
      var fragment = {}

      _.each(DEFS.fragment, function(attr_def, attr_name) {
        if (original.hasOwnProperty(attr_name)) {
          fragment[attr_name] = original[attr_name]
        }
      })

      return fragment
    }

    function merge(fragment, source) {
      fragment = cleanFragment(fragment)
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
      }
     }

    function recall(source, filter) {
      var extraction = {
            initiated_at: initiated_at,
            extracted_at: Date.now(),
            paths: Memory.paths,
            removed: removed,
            preferences: MIND.front.getPreferences(),
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
      var validation_errors   = []
      var text_valid          = validate.fragment(text)
      var path_valid          = validate.path(path)
      var mem_valid           = validate.memory(text, path)
      var validations         = [text_valid, path_valid, mem_valid]
      var is_valid            = true

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

    function addNote(options) {
      var validation = validate.note(options)
      var result     = {
        success: false,
        message: "Adding note failed."
      }

      if (validation.pass) {
        var fragment = get(options.parent_id)

        if (fragment && fragment.id) {
          fragment.notes = fragment.notes || []
          fragment.notes.push({
            id: Date.now(),
            text: options.text,
            created_at: Date.now(),
            updatedAt: Date.now()
          })
          result.success = true
          result.message = "Note added."
        }
        else {
          result.message = "Unable to associate note to fragment."
        }
      }
      else {
        result.message = "Incorrect note format."
      }
      return result
    }

    function get(fragment_id) {
      var match
      var matches = fragments.filter(function(fragment) {
        var matching = (fragment.id === fragment_id)

        if (matching) match = fragment
        return matching
      })

      return match
    }

    function repath(fragment, new_path_index) {
      var path = MIND.Memory.paths[new_path_index]
      var success

      if (path && path.length) {
        fragment.path = path
        success = true
      }
      return success
    }

    function forget(fragment_id) {
      var fragment = get(fragment_id)
      var success

      if (fragment) {
        fragment.memorized = false
        success = true
      }

      return success
    }

    function remove(fragment_id) {
      var success

      for (var i = 0; i < fragments.length; i++) {
        var fragment = fragments[i]

        if (fragment && fragment.id === fragment_id) {
          fragments.splice(i, 1)
          removed.push(fragment.id)
          success = true
          break
        }
      }

      return success
    }

    function remember(fragment_id) {
      var fragment = get(fragment_id)
      var success

      if (fragment) {
        fragment.memorized = true
        success = true
      }

      return success
    }

    return {
      add,
      addNote,
      merge,
      get,
      remove,
      recall,
      forget,
      repath,
      remember,
      fragments,
      removed,
      on_display: [],
      on_path: [],
      initiated_at,
      initiated_at_f: fDate(initiated_at),
      owner: current_user,
      LIMITS,
      DEFS,
      BASIC_PATHS,
      paths: BASIC_PATHS.slice(0)
    }
  } ())

  // Add path to memory, first check if it is unique
  function addPath(path) {
    var current_path_dupes = Memory.paths.filter(function(path_rec) {
      return comparePaths(path_rec, path).identical
    })

    return (current_path_dupes.length ? false : Memory.paths.push(path))
  }

  // Save snapshot to local storage in order to resurrect it when browser reloads
  function saveMemorySnapshot() {
    var mem_len = Memory.fragments.length

    if (mem_len) {
      MIND.log("saveMemorySnapshot | mem_len:", mem_len)
      localStorage.setItem(mem_pointer, JSON.stringify(Memory.recall()))
    }
  }

  // Wipe out the memory
  function clean() {
    var now = Date.now()

    Memory.fragments = []
    Memory.removed = []
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
      parsing_error,
      parsed_content,
      is_encrypted
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
          if (snapshot.preferences) {
            MIND.front.applyPreferences(snapshot.preferences)
          }
        }
        else {
          notify("Unable to load memory. " + (
            parsing_error ? "Memory is corrupt." : ""))
        }
      }
    }
  }

  // Validate snapshot in order to merge it
  function validSnapshot(snapshot) {
    return (
      snapshot && typeof(snapshot) === "object" &&
      snapshot.fragments && snapshot.fragments.length
    )
  }

  // Compare paths if they are identical or inclusive of each other
  // Serves to display fragments on path
  function comparePaths(child_path, parent_path) {
    var intersect = _.intersection(child_path, parent_path)
    var inclusive = (intersect.length === parent_path.length)
    var identical = inclusive && (child_path.length === intersect.length)

    return {
      intersect: intersect,
      inclusive: inclusive,
      identical: identical,
      child_path: child_path,
      parent_path: parent_path
    }
  }

  // To merge fragments from loaded memory snapshot
  function mergeMemory(snapshot, source) {
    var source = (source || snapshot.source || "local")

    // Merge removed fragment ids history with current snapshot
    Memory.removed = _.union(Memory.removed, snapshot.removed || [])
    snapshot.fragments.forEach(function(fragment, fidx) {
      // If this fragment has not been removed, merge it into memory
      if (Memory.removed.indexOf(fragment.id) === -1) {
        MIND.log("mergeMemory | fragment:", fragment)
        Memory.merge(fragment, source)
      }
      else {
        MIND.log("mergeMemory | removed fragment:", fragment)
      }
    })
    if (snapshot.paths) snapshot.paths.forEach(addPath)
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

  // Export reusable for MIND.front and other accessors
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
    fDate: fDate,
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
