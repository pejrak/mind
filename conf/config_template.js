// Application configuration

module.exports = {
  // Environment specific
  production: {
    port: 3337,
    storage_dir: "/tmp",
    url: "https://www.example.com/"
  },
  test: {
    port: 3331,
    storage_dir: "/tmp",
    url: "https://www.example-test.com/"
  },  
  development: {
    port: 3000,
    storage_dir: "/tmp",
    url: "https://localhost/"
  },
  // Non-env specific
  secret: 'XXXXX',
  google_oauth: {
    key: 'XXXXX',
    secret: 'XXXXX'
  }
}