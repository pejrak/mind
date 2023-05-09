import { getLogLevel } from './getLogLevel'

export const log = label => {
  const level = getLogLevel()
  const _log = (args, logType) => {
    if (level > 0) {
      args = Array.prototype.slice.call(args)
      args.unshift(`[${label}]:`)
      console[logType].apply(console, args)
    }
  }

  return {
    error() { _log(arguments, 'error') },
    warn() { _log(arguments, 'warn') },
    info() { _log(arguments, 'info') },
    log() { _log(arguments, 'log') },
    silent() { /* nothing */ }
  }
}
