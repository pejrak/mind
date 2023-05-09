import server from '../server'

export const saveMemory = ({
  content,
  storageType = 'remoteMind',
}) => server.post(`/memory/${storageType}`, { content })

export const loadMemory = ({
  storageType = 'remoteMind',
} = {}) => server.get(`/memory/${storageType}`)
