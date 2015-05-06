// Application configuration

module.exports = {
  // Environment specific
  production: {
    port: 3000,
    storage_dir: "/tmp"
  },
  development: {
    port: 3000,
    storage_dir: "/tmp"
  },
  // Non-env specific
  secret: 'XXXXX',
  google_oauth: {
    key: 'XXXXX',
    secret: 'XXXXX'
  }
}