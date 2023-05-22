import { config } from '../../config'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import { resolve } from 'path'
import { environment } from '../system/environment'
// import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

const { uiPort = 3000, serverUrl, uiUrl } = config

export default () => {
  console.log('vite.config.js', environment, resolve(__dirname, './index.html'))
  return defineConfig({
    define: {
      __SERVER_URL__: JSON.stringify(serverUrl),
      __UI_URL__: JSON.stringify(uiUrl),
      __ENVIRONMENT__: JSON.stringify(environment),
    },
    entry: resolve(__dirname, './index.js'),
    build: {
      outDir: resolve(__dirname, '../../public/internal'),
      rollupOptions: {
        input: {
          main: resolve(__dirname, '../index.js'),
        },
      }
    },
    server: {
      port: uiPort,
    },
    plugins: [
      vue(),
    ],
  })
}
