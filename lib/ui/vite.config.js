import { config } from '../../config'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
// import { resolve } from 'path'
import { environment } from '../system/environment'
// import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

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
    // entry: resolve(dir, './index.js'),
    // build: {
    //   outDir: resolve(dir, '../../public/internal'),
    //   rollupOptions: {
    //     input: {
    //       main: resolve(dir, '../index.html'),
    //     },
    //   }
    // },
    server: {
      port: uiPort,
    },
    plugins: [
      vue(),
    ],
  })
}
