
const config = require('./config');

module.exports = {
  ...config,
  getCurrentEnvConfig() {
    return config[process.env.NODE_ENV || 'development'];
  }
};