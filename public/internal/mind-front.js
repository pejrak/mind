MIND.front = (function() {
  // Initialize listeners
  function init() {
    $("#memory-submit").click(submitMemory)
    $("body").on("click", "#memory-extract-link", extract)
  }

  function getCurrentPath() {
    var path_selector = $("#mind-path-select")
    return (
      path_selector && path_selector.length ? 
        path_selector.val() : MIND.Memory.paths[0]
    )
  }

  function cleanFragmentInput() {
    $("#memory-fragment-input").val("")
  }

  function submitMemory() {
    var text = $("#memory-fragment-input").val()
    var current_path = getCurrentPath()
    var add_result = MIND.Memory.add(text, current_path)

    if (add_result.validation_errors) {
      add_result.validation_errors.forEach(function(val_message) {
        MIND.notify(val_message)
      })
    }
    else {
      MIND.notify("Added fragment.")
      cleanFragmentInput()
    }
    refresh()
  }

  function filterFragmentsOnPath() {
    var filtered = []
    var fragments = MIND.Memory.fragments || []

    fragments.forEach(function(fragment) {
      var path_comparison = comparePaths(fragment.path, getCurrentPath())
      MIND.log("path_comparison:", path_comparison)
      if (!path_comparison.diff_left.length) {
        filtered.push(fragment)
      }
    })
    return filtered
  }

  function comparePaths(child_path, parent_path) {
    return {
      diff_right: $(parent_path).not(child_path).get(),
      diff_left: $(child_path).not(parent_path).get()
    }
  }

  function displayPathSelections() {
    
    var current_paths = MIND.Memory.paths
    current_paths.forEach(function(path) {
      
    })

  }

  function displayFragments() {
    MIND.log("displayFragments | my fragments:", MIND.Memory.fragments)

    var current_time = Date.now()
    var fragments_to_show = filterFragmentsOnPath()
    var count = fragments_to_show.length
    var fragment_list = MIND.render("memory_fragments_list_tmpl", {
          label: (fragments_to_show.length ? (
            "Displaying " + count + " fragment" + (count === 1 ? "" : "s") + "."
          ) : "No fragments on path.")
        })

    $("#memory-fragments-container").html(fragment_list)

    fragments_to_show.forEach(function(fragment) {
      var fragment_content = MIND.render("memory_fragment_tmpl", fragment)
      $("#memory-fragments-list").append(fragment_content)
    })

  }

  function displayMemoryOperators() {
    var count = MIND.Memory.fragments.length

    // First remove extractor
    $("#memory-extract").remove()
    if (count) {
      var extraction_operator = MIND.render("memory_fragments_extract_tmpl", {
            count: count
          })
      $("#memory-operators").append(extraction_operator)
    }
  }

  function extract() {
    var memory_fragments = MIND.Memory.fragments
    MIND.log("extract | memory_fragments:", memory_fragments)
  }

  function refresh() {
    displayFragments()
    displayPathSelections()
    displayMemoryOperators()
  }

  return {
    init: init,
  }
} ())


$(document).ready(MIND.front.init)