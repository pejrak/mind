import Axios from 'axios'

export const fragmentPathComponentExists = name => Axios.get(
  '/component', {
    params: { name }
  }
)
