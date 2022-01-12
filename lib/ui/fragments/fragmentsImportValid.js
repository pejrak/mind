export const fragmentsImportValid = content => (
  content &&
  typeof content === 'object' &&
  content.fragments instanceof Array &&
  content.paths instanceof Array
)
