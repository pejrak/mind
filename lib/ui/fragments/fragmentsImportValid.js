export const fragmentsImportValid = content => (
  content &&
  typeof content === 'object' &&
  content.initiated_at > 0 &&
  content.fragments instanceof Array
)