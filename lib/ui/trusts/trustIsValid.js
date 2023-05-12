import {
  fragmentPathIsValid
} from '../fragmentPaths/fragmentPathIsValid'

export const trustIsValid = (trust) => {
  return (
    trust.recipient?.length > 6 && fragmentPathIsValid(trust.path)
  )
}
