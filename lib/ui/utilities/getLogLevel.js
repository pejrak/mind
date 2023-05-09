import { environment } from '../constants'
export const getLogLevel = () => (environment === 'development' ? 1 : 0)