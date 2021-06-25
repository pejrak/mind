const redis = require('redis')
const getNewClient = () => redis.createClient()
const client = getNewClient()

module.exports = {
  client,
  getNewClient,
}
