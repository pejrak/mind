// User controller

module.exports = function (MIND) {
  LOG = MIND.LOG("user")
  MIND.route.get('/users', function (req, res) {
    LOG('got users request')
    res.send({requested: 'Users here'})
  })
}