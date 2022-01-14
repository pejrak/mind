export const transforms = {
  string: val => `${val}`,
  integer: val => parseInt(val),
  float: val => parseFloat(val),
}
