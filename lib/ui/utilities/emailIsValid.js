export const emailIsValid = (email) =>
  typeof email === 'string' && email.length > 4
