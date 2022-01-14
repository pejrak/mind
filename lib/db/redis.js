import redis from 'redis'

export const getNewClient = () => redis.createClient()
export const client = getNewClient()
