export const pathsMatching = ({ parent, path, exact = false }) =>
  exact
    ? (
      path.every((component, idx) => component === parent[idx]) &&
      path.length === parent.length
    )
    : path.every((component) => parent.includes(component))
