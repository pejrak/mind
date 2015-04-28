MIND.front = (function() {

  // Initialize listeners
  function init() {

    $("#memory-submit").click(submitFragment)
    $("#memory-search").on("input", searchMemory)

    // Dynamic listeners
    $("body").on("click", "#memory-extract-link", extract)
    $("body").on("click", "#memory-wipe-link", wipe)

    MIND.index = initSearch()
    displayPathSelections()
    MIND.checkCurrentUser()
    MIND.loadMemorySnapshot()
    refresh()
  }

  function initSearch() {
    return lunr(function () {
      var idx = this
      idx.field("text", { boost: 10 })
      idx.field("path")
      idx.ref("id")
    })
  }

  function searchMemory(event) {
    MIND.timeIt(function() {
      refresh()
    })
  }

  function getCurrentPath() {
    var path_selector = $("#mind-path-select")
    return (
      path_selector && path_selector.length ? 
        path_selector.val().split("|") : MIND.Memory.paths[0]
    )
  }

  function cleanFragmentInput() {
    $("#memory-fragment-input").val("")
  }

  function submitFragment() {
    var text = $("#memory-fragment-input").val()
    var current_path = getCurrentPath()
    var add_result = MIND.Memory.add(text, current_path)

    if (add_result.validation_errors) {
      add_result.validation_errors.forEach(function(val_message) {
        MIND.notify(val_message)
      })
    }
    else {
      MIND.notify("Added memory fragment.")
      MIND.saveMemorySnapshot()
      cleanFragmentInput()
    }
    refresh()
  }

  function filterFragments() {
    var query = $("#memory-search").val()
    var filtered = []
    var fragments = MIND.Memory.fragments || []

    fragments.forEach(function(fragment) {
      var path_comparison = comparePaths(fragment.path, getCurrentPath())
      // MIND.log("path_comparison:", path_comparison)
      if (!path_comparison.diff_left.length) {
        filtered.push(fragment)
      }
    })
    MIND.Memory.on_path = filtered.slice(0)
    if (query && query.length > 1) {
      var hits = MIND.index.search(query)
      var matching_ids = hits.map(function(hit) {
        return parseInt(hit.ref)
      })

      MIND.log("filterFragments | matching_ids:", matching_ids)
      var matching = filtered.filter(function(fragment) {
        return (matching_ids.indexOf(fragment.id) > -1)
      })
      filtered = matching
    }
    return filtered
  }

  function comparePaths(child_path, parent_path) {
    return {
      diff_right: $(parent_path).not(child_path).get(),
      diff_left: $(child_path).not(parent_path).get()
    }
  }

  function pathName(path) {
    var name = ""
    var path_len = path.length

    path.forEach(function(point, p_idx) {
      var last_point = ((p_idx + 1) === path_len)
      name += (MIND.capLead(point) + (last_point ? "" : " - "))
    })

    return name
  }

  function displayPathSelections() {
    var selector

    // First render the selector
    $("#memory-path-selection-container").html(
      MIND.render("memory_path_selection_tmpl")
    )
    selector = $("#memory-path-select")
    // Now render options for the selector
    MIND.Memory.paths.forEach(function(path) {
      selector.append(MIND.render("memory_path_select_option_tmpl", {
        key: path.join("|"),
        name: pathName(path)
      }))
    })
  }

  function displayFragments() {

    var filtered_fragments = filterFragments()
    var current_time = Date.now()
    var count = filtered_fragments.length
    var fragments_content = ""
    var fragment_list = MIND.render("memory_fragments_list_tmpl", {
          label: (count ? (
            "Displaying " + count + " fragment" + (count === 1 ? "" : "s") + "."
          ) : "No fragments on path.")
        })

    MIND.Memory.on_display = filtered_fragments
    filtered_fragments.forEach(function(fragment) {
      fragments_content += MIND.render("memory_fragment_tmpl", fragment)
    })
    $("#memory-fragments-container").html(fragment_list)
    $("#memory-fragments-list").html(fragments_content)
  }

  function displayMemoryOperators() {
    var count = MIND.Memory.fragments.length

    // First remove extractor
    $("#memory-extract,#memory-wipe").remove()
    if (count) {
      var extraction_operator = MIND.render("memory_fragments_extract_tmpl", {
            count: count
          })
      var wipe_operator = MIND.render("memory_wipe_tmpl", {
            count: count
          })

      $("#memory-operators").append(extraction_operator, wipe_operator)
    }
  }

  function displaySearch() {
    var action = (
          MIND.Memory.on_path && MIND.Memory.on_path.length
        ) ? "show" : "hide"
    $("#memory-search")[action]()
  }

  function extract() {
    var memory_fragments = MIND.Memory.fragments
    var extract_str = JSON.stringify(memory_fragments)
    MIND.log("extract | memory_fragments:", memory_fragments)
    // alert(extract_str)
    var enc_extract = encrypt(extract_str)
    alert("ENCRYPTED:\n" + enc_extract)
    if (enc_extract) {
      var dec_extract = decrypt(enc_extract)
      alert("DECRYPTED:\n" + dec_extract)
    }
  }

  function wipe() {
    var confirmation = confirm("Do you want to erase all unsaved fragments?")
    
    if (confirmation) {
      MIND.clean()
      refresh()
    }
    else {
      MIND.notify("Wipe out cancelled.")
    }
  }

  function printEncRequirements(enc_limits) {
    
    return (
      "- Minimum length: " + enc_limits[0] + " characters.\n" + 
      "- Maximum length: " + enc_limits[1] + " characters.\n"
    ) 
  }

  function encrypt(text, prompt_message) {
    var enc_limits = MIND.Memory.LIMITS.enc_pwd_len
    var enc_pwd

    prompt_message = (prompt_message || "Provide password for encryption:")
    prompt_message += ("\n\n" + printEncRequirements(enc_limits))
    enc_pwd = prompt(prompt_message)

    if (!enc_pwd) {
      return null
    }
    else if (
      enc_pwd.length >= enc_limits[0] && enc_pwd.length <= enc_limits[1]
    ) {
      var enc_pwd_retype = prompt("Please retype the password to confirm.")

      if (!enc_pwd_retype) {
        return null
      }
      else if (enc_pwd === enc_pwd_retype) {
        var enc_text = sjcl.encrypt(enc_pwd, text)
        return enc_text  
      }
      else {
        encrypt(text, "Error: Confirmation password did not match!")
      }
    }
    else {
      encrypt(text, "Error: Password invalid.")
    }
  }

  function decrypt(enc_text, prompt_message) {
    prompt_message = (prompt_message || "Provide password for decryption:")
    
    var enc_pwd = prompt(prompt_message)

    if (!enc_pwd) {
      return null
    }
    else {
      var dec_text
      try {
        dec_text = sjcl.decrypt(enc_pwd, enc_text)
      }
      catch(decryption_error) {
        MIND.notify("Decryption error (Password provided may be incorrect).")
      }
      finally {
        return dec_text
      }
    }
  }

  function refresh() {
    displayFragments()
    displayPathSelections()
    displayMemoryOperators()
    displaySearch()
  }

  return {
    init: init,
  }
} ())


$(document).ready(MIND.front.init)