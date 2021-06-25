import Axios from 'axios'

export const saveMemory = ({
  content,
  storageType = 'remoteMind',
}) => Axios.post(`/memory/${storageType}`, { content })

export const loadMemory = ({
  storageType = 'remoteMind',
} = {}) => Axios.get(`/memory/${storageType}`)
