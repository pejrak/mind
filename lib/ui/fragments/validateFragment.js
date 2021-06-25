export const validateFragment = ({
  createdAt,
  id,
  memorized,
  notes,
  owner,
  path,
  text,
  updatedAt,
}) => (
  createdAt > 0 && createdAt <= Date.now() &&
  updatedAt > 0 && updatedAt <= Date.now() &&
  typeof id === 'number' && id > 0 &&
  typeof memorized === 'boolean' &&
  typeof owner === 'string' && owner.length > 1 &&
  path instanceof Array && path.length && path.length <= 4 &&
  notes instanceof Array &&
  typeof text === 'string' && text.length > 2
)
