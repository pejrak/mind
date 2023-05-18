import { createClient } from 'redis'

export const getNewClient = () => {
  const client = createClient({ port: 6379 })

  client.connect()

  return client
}
export const client = getNewClient()
export const createLegacyClient = () => {
  const client = createClient({
    port: 6379,
    legacyMode: true,
  })

  client.connect()
  return client
}
