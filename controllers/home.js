'use strict'

module.exports = function (MIND) {

  MIND.route.get('/', function (req, res) {
    res.render('home/home', { welcome: true })
  }, {no_auth: true})

  return {}
}