export const pathsMatching = ({
  parent,
  path,
}) => path.every(component => parent.includes(component))