import { pathsMatching } from './pathsMatching'

export const fragmentMatchingSearch = ({
  fragment,
  include,
  path,
  query,
}) => {
  if (!include) return false

  const onPath = !path || pathsMatching({
    path: fragment.path,
    parent: path,
  })

  if (!onPath) return false

  if (typeof query === 'string' && query.length > 1) {
    const searchContent = (
      `${fragment.owner || ''}:${fragment.text}:` +
      `${fragment.notes.map(({ text }) => text).join(',')}`
    )
    const regexp = new RegExp(query, 'ig')
    const matching = regexp.test(searchContent)

    return matching
  } else {
    return true
  }
}