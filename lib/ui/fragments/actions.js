import Axios from 'axios'

export const saveMemory = ({
  content,
  storageType = 'remoteMind',
}) => Axios.post(`/store/${storageType}`, { content })
