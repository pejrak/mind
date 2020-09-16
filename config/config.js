// Application configuration

module.exports = {
  name: 'Mind',
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
    storage_dir: "/var/www/mind/tmp",
    url: "http://localhost:3000/"
  },
  // Non-env specific
  secret: 'mySecretIsNotYours',
  google_oauth: {
    key: '200366828045-tgjt3932tsnbn3a8j9idhtdh8r9m3af5.apps.googleusercontent.com',
    secret: '99ReX9WySYI6KGt1BXLorica'
  },
  jwt_auth: {
    secret: 'mySigningSecretIsNotYours',
  },
}