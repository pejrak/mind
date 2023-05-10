// Application configuration
export const config = {
  name: 'mind',
  port: 3337,
  uiPort: 3030,
  storageDirectory: '/tmp',
  serverUrl: 'https://www.example.com/',
  uiUrl: `http://localhost:${uiPort}/`,
  peerServerPort: 3338,
  secret: 'XXXXX',
  googleOauth: {
    key: 'XXXXX',
    secret: 'XXXXX'
  },
  jwtAuth: {
    secret: 'xxxxx',
  },
}
