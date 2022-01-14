import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

export const directory = resolve(
  dirname(fileURLToPath(import.meta.url)), '../../'
)
