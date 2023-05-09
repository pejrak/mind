export const tokenAuthKey = 'authToken'
export const tokenUserKey = 'authUserEmail'
export const token = (key = tokenAuthKey) => ({
  set(value) {
    localStorage.setItem(key, value)
    return !!value
  },
  get() {
    return localStorage.getItem(key)
  },
})
