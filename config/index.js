
import { config as conf } from './config.js'

export const config = {
  ...conf,
  getCurrentEnvConfig() {
    return conf
  }
}
