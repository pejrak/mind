MIND.front = (function() {
  // Initialize listeners
  function init() {
    $("#mind-create").click(create)
  }

  function create(event) {
    MIND.log("create | event:", event)
  }

  return {
    init: init,
  }
} ())


$(document).ready(MIND.front.init)