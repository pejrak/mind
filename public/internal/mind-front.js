MIND.front = (function() {

  var containers = {
    extraction_modal_id: "mind-extraction-modal",
    load_modal_id: "mind-load-modal",
    profile_modal_id: "mind-profile-modal",
    path_creation_modal_id: "mind-path-creation-modal"
  }

  // Initialize listeners
  function init() {

    $("#memory-submit").click(submitFragment)
    $("#memory-search").on("input", searchMemory)
    $(".mind-profile").click(showProfile)

    // Dynamic listeners
    $("body").on("click", "#memory-extract-link", extractConfirm)
    $("body").on("click", "#memory-wipe-link", wipe)
    $("body").on("click", "#mind-extract-submit", extractSubmit)
    $("body").on("click", "#mind-load-submit", loadSubmit)
    $("body").on("click", "#memory-load", loadConfirm)
    $("body").on("change", "#load-source-select", toggleLoadLocal)
    $("body").on("change", "#memory-path-select", triggerPathSelection)
    $("body").on("click", "#mind-profile-update", profileConfirm)
    $("body").on("input", "#path-component-input", checkPathComponent)
    $("body").on("click", "#path-component-confirm", confirmPathComponent)

    MIND.index = initSearch()
    displayPathSelections()
    MIND.checkCurrentUser()
    MIND.loadMemorySnapshot()
    refresh()
  }

  function confirmPathComponent() {
    var path_component_str = $("#path-component-input").val()
    var path_components = getNewPathComponents()

    path_components.push(path_component_str)

    

  }

  function getNewPathComponents() {
    var components = []
    var comp_elements = $(".mind-path-component", "#mind-path-components")

    $.each(comp_elements, function(i, element) {
      var path_component_str = $(element).text()

      components.push(path_component_str)
    })
    return components
  }

  function checkPathComponent() {
    var input_str = $("#path-component-input").val()
    
    $("#path-component-confirm").prop("disabled", true)
    if (input_str && input_str.length > 2) {
      var current_components = getNewPathComponents()
      var component_on_path = current_components.indexOf(input_str) > -1
      var component_limit_reach = current_components.length > 2

      if (component_on_path || component_limit_reach) {
        MIND.log("checkPathComponent | component already added.")
      }
      else {
        MIND.timeIt(function() {
          confirmPathComponentAvailable(input_str, function(response) {
            if (response && response.available) {
              $("#path-component-confirm").prop("disabled", false)
            }
          })  
        })
      }
    }
  }

  function confirmPathComponentAvailable(path_component, done) {
    $.post("/check_path_component", {
      query: path_component
    }, done)
  }

  function triggerPathSelection() {
    var path_selection = $("#memory-path-select").val()

    MIND.log("triggerPathSelection | path_selection:", path_selection)
    if (path_selection === "new") showPathCreation()
  }

  function showPathCreation() {
    var modal_id = containers.path_creation_modal_id
    var path_modal_content = MIND.render("modal_dialog_tmpl", {
          modal_id: modal_id,
          title: "New mind path",
          body: MIND.render("path_creation_input_tmpl", {}),
          button_label: "Add path now",
          button_id: "mind-path-create"
        })

    showModal(modal_id, path_modal_content)  
  }

  function profileConfirm() {
    var storage_options = {
      key: $("#mind-storage-key").val(),
      secret: $("#mind-storage-secret").val()
    }
   
    $.post("/profile/update", storage_options, function(response) {
      hideModal(containers.profile_modal_id)
      MIND.notify(response.message)
    })
  }

  function loadSubmit() {
    var selected_source = $("#load-source-select").val()
    var loaded_memory

    hideModal(containers.load_modal_id)
    loadStoredMemory(selected_source, function (errors, content) {
      var data = MIND.checkStructure(content)
      MIND.log("loadSubmit | data:", data)
      if (data.parsing_error) {
        MIND.notify("Unable to process loaded memory (parsing error).")
      }
      else {
        if (data.is_encrypted) {
          var to_parse = decrypt(JSON.stringify(data.parsed_content))
          if (to_parse && to_parse.length) {
            loaded_memory = JSON.parse(to_parse)
          }
        }
        else {
          loaded_memory = data.parsed_content
        }
        if (
          MIND.validSnapshot(loaded_memory)
        ) {
          MIND.mergeMemory(loaded_memory, selected_source)
          cleanSearchInput()
          refresh()
        }
        else {
          MIND.notify("Unable to decrypt data.")
        }
        // MIND.log("loaded_memory:", loaded_memory)
      }
    })
  }

  function cleanSearchInput() {
    $("#memory-search").val("")
  }

  function showProfile() {
    var modal_id = containers.profile_modal_id

    $.get("/profile", function(response) {
      if (response && response.profile) {
        var profile_modal_content = MIND.render("modal_dialog_tmpl", {
          modal_id: modal_id,
          title: "My profile (" + response.profile.email + ")",
          body: MIND.render("profile_input_tmpl", response.profile),
          button_label: "Update now",
          button_id: "mind-profile-update"
        })    
        showModal(modal_id, profile_modal_content)      
      }
      else {
        MIND.notify(
          "Error: Unable to load profile (May need to refresh or login again)."
        )
      }
    })
  }



  function loadStoredMemory(source, done) {
    var loadMethods = {
      local: function() {
        return loadLocalFile(done)
      },
      remote_mind: function() {
        return loadRemoteMemory(source, done)
      },
      remote_dropbox: function() {
        return loadRemoteMemory(source, done)
      }
    }
    var loadMethod = loadMethods[source]

    if (loadMethod) loadMethods[source]()
  }

  function loadLocalFile(done) {
    var selected_file = document.getElementById("load-source-file").files[0]

    if (selected_file) {
      var reader = new FileReader()
      reader.onload = function (event) {
        return done(null, event.target.result)
      }
      reader.readAsText(selected_file)
    }
    else {
      MIND.notify("No file is selected.")
      return done()
    }
  }

  function loadRemoteMemory(source, done) {
    var content

    $.get("/storage/load/" + source, function(response) {
      if (response && response.content) {
        var content_base = response.content
        content = MIND.fromBase(content_base)
        return finalize()
      }
      else {
        return finalize()
      }
    })

    function finalize() {
      return done(null, content)
    }
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

  function toggleLoadLocal() {
    var selected_source = $("#load-source-select").val()
    $("#load-source-file")[(selected_source === "local") ? "show" : "hide"]()
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
    // First render the selector
    $("#memory-path-selection-container").html(
      MIND.render("memory_path_selection_tmpl")
    )
    var selector = $("#memory-path-select")
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
      fragment.memorized = (fragment.memorized === true ? true : false)
      fragments_content = (
        MIND.render("memory_fragment_tmpl", fragment) + fragments_content
      )
    })
    $("#memory-fragments-container").html(fragment_list)
    $("#memory-fragments-list").html(fragments_content)
    $(".mind-fragment-text").linkify()
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

  function extractConfirm(message) {
    var memory_recall = MIND.Memory.recall()
    var modal_id = containers.extraction_modal_id
    var fragment_count = memory_recall.fragments.length
    var modal_title = (typeof(message) === "string" ? message : (
      "Extract memory fragments (" + fragment_count + ")"
    ))
    var front_auth = (
          typeof(MIND.current_user) === "string" && 
          MIND.current_user !== "none"
        )

    MIND.log("extract | fragment_count, MIND.current_user:", fragment_count, MIND.current_user)
    // First remove any extraction modal previously created

    var extraction_modal_content = MIND.render("modal_dialog_tmpl", {
      modal_id: modal_id,
      title: modal_title,
      body: MIND.render("extraction_input_tmpl", {
        count: fragment_count,
        password_requirements: 
          printEncRequirements(MIND.Memory.LIMITS.enc_pwd_len),
        remote_dropbox: false,
        remote_mind: front_auth
      }),
      button_label: "Extract now",
      button_id: "mind-extract-submit"
    })

    showModal(modal_id, extraction_modal_content)
  }

  function showModal(modal_id, modal_content) {
    hideModal(modal_id, true)
    $("#content").append(modal_content)
    $("#" + modal_id).modal("show")
  }

  function loadConfirm() {
    checkStorageStatus(function (errors, storage_status) {
      MIND.log("loadConfirm | storage_status:", storage_status)
      var modal_id = containers.load_modal_id
      var load_modal_content = MIND.render("modal_dialog_tmpl", {
        modal_id: modal_id,
        title: "Load memory",
        body: MIND.render("load_input_tmpl", {
          remote_dropbox: storage_status.remote_dropbox,
          remote_mind: storage_status.remote_mind
        }),
        button_label: "Load now",
        button_id: "mind-load-submit"
      })

      showModal(modal_id, load_modal_content)
    })
  }


  function checkStorageStatus(done) {
    var source_options = {
      remote_mind: false,
      remote_dropbox: false
    }

    MIND.notify("Checking storage status")
    if (MIND.current_user && MIND.current_user !== "none") {
      $.get("/storage/status", function (response) {
        if (response && response.source_options) {
          var loaded_source_options = response.source_options

          source_options.remote_mind = loaded_source_options.remote_mind
          source_options.remote_dropbox = loaded_source_options.remote_dropbox
          return finalize()
        }
        else return finalize()
      })
    } else return finalize()

    function finalize() {
      return done(null, source_options)
    }
  }

  function extractSubmit(event) {
    var enc_pwd = $("#extraction-password").val()
    var storage_selection = $("#extraction-target-select").val()
    var memory_recall = MIND.Memory.recall(storage_selection)
    var extract_str = JSON.stringify(memory_recall)
    var content_extract

    MIND.log("extractSubmit | enc_pwd:", enc_pwd)

    if (enc_pwd && enc_pwd.length) {
      if (passwordValid(enc_pwd, MIND.Memory.LIMITS.enc_pwd_len)) {
        content_extract = sjcl.encrypt(enc_pwd, extract_str)
        MIND.log("encrypted content_extract:", content_extract)
      }
      else {
        extractConfirm("Error: Password invalid.")
      }
    }
    else {
      // We are only downloading as plain text
      content_extract = extract_str
    }

    if (content_extract) {
      extract(storage_selection, content_extract)
      hideModal(containers.extraction_modal_id)
    }
  }

  function hideModal(modal_id, remove) {
    var el_id = "#" + modal_id

    if (remove) {
      $(el_id).remove()
    }
    else {
      $(el_id).modal("hide")
    }
  }

  function extract(storage_selection, content_extract) {
   
    var storageExtraction = {
      local: function() {
        localStore(content_extract)
      },
      remote_mind: function() {
        remoteStore("remote_mind", content_extract)
      },
      remote_dropbox: function() {
        remoteStore("remote_dropbox", content_extract)
      }
    }

    // Check the current user selection
    MIND.checkCurrentUser()
    storageExtraction[storage_selection]()
  }

  function localStore(content_extract) {

    MIND.log("localStore | content_extract:", content_extract)

    var file_name = (
          "content_extract_" + Date.now() + "_" +
          MIND.current_user.replace(/[^a-z0-9]/gi, "_") +  ".txt"
        )
    $("#local-download")
      .attr("href", (
        "data:text/plain;charset=UTF-8," + content_extract
      ))
      .attr("download", file_name)
    document.getElementById("local-download").click()
  }

  function remoteStore(storage_type, content_extract) {
    var content_encoded = MIND.toBase(content_extract)
    
    $.post("/store/" + storage_type, {
      extract: content_encoded     
    }, function (response) {
      MIND.notify(response.message)
    })
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

  function passwordValid(enc_pwd, enc_limits) {
    return (enc_pwd.length >= enc_limits[0] && enc_pwd.length <= enc_limits[1])
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
        MIND.log("decryption_error:", decryption_error)
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