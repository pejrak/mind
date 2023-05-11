import { log } from '../utilities/log'

export const validateFragment = (fragment) => {
  const {
    createdAt,
    id,
    memorized,
    notes,
    owner,
    path,
    text,
    updatedAt,
  } = fragment
  const createdAtValid = createdAt > 0 && createdAt <= Date.now()
  const updatedAtValid = updatedAt > 0 && updatedAt <= Date.now()
  const idIsValid = typeof id === 'number' && id > 0
  const memorizedIsBoolean = typeof memorized === 'boolean'
  const ownerIsValid = typeof owner === 'string' && owner.length > 1
  const pathIsValid =
    path instanceof Array && path.length && path.length <= 4
  const notesAreValid = notes instanceof Array
  const textIsValid = typeof text === 'string' && text.length > 2
  const fragmentIsValid =
    createdAtValid &&
    updatedAtValid &&
    idIsValid &&
    memorizedIsBoolean &&
    ownerIsValid &&
    pathIsValid &&
    notesAreValid &&
    textIsValid
  if (!fragmentIsValid) {
    log('validateFragment').info('invalid fragment', fragment, {
      createdAtValid,
      updatedAtValid,
      idIsValid,
      memorizedIsBoolean,
      ownerIsValid,
      pathIsValid,
      notesAreValid,
      textIsValid,
    })
  }

  return fragmentIsValid
}
