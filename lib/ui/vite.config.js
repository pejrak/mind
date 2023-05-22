import { config } from '../../config'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { environment } from '../system/environment'

const { uiPort = 3000, serverUrl, uiUrl } = config
const dir = __dirname

export default () => {
  console.log('vite.config.js', {
    environment,
    dir,
  })
  return defineConfig({
    define: {
      __SERVER_URL__: JSON.stringify(serverUrl),
      __UI_URL__: JSON.stringify(uiUrl),
      __ENVIRONMENT__: JSON.stringify(environment),
    },
    root: dir,
    server: {
      port: uiPort,
    },
    plugins: [
      vue(),
    ],
  })
}
