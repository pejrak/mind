import { pathsMatching } from '../fragments/pathsMatching'

export const dataIsTrusted = ({
  path,
  sender,
  trusts,
  // ...data
}) => {
  return !!trusts.find(
    ({ recipient, path: trustedPath }) =>
      recipient === sender &&
      pathsMatching({ path: trustedPath, parent: path }),
  )
}
