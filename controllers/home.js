'use strict'

module.exports = function (MIND) {

  var LOG = MIND.LOG('home')

  MIND.route.get('/', function (req, res) {
    res.render('home/home')
  }, { no_auth: true })

  return {}
}