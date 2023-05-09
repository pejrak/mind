<template lang="pug">
.container
  .jumbotron
    h1 Login
    hr
    h2 Login with your credentials.
    hr
    b-form(@submit.prevent="onLoginAttempt")
      b-row
        b-col
        b-col
          b-form-group(
            label="Email"
            label-cols="4"
            :state='emailInputIsValid'
          )
            b-form-input(
              type="text"
              v-model="emailInput"
              :state='emailInputIsValid'
            )
          b-form-group(
            label="Password"
            label-cols="4"
            :state='passwordInputIsValid'
          )
            b-form-input(
              type="password"
              v-model="passwordInput"
              :state='passwordInputIsValid'
            )
        b-col
      b-row
        b-col
        b-col
          b-button.float-right(
            :disabled='loading || !inputIsValid'
            variant="primary"
            type="submit"
          ) Log in
          .clearfix
          hr
          b-link.float-right(href="https://app.simpli.fi/users/forgot_password") Forgot password?
        b-col
</template>

<script>
import { server } from '../server'
import { token, tokenUserKey, tokenAuthKey } from './token'
import log from '../utilities/log'
import { serverUrl } from '../constants'

const logger = log('Login')

export default {
  computed: {
    emailInputIsValid() {
      return this.emailInput.length > 0
    },
    inputIsValid() {
      return this.emailInputIsValid && this.passwordInputIsValid
    },
    passwordInputIsValid() {
      return this.passwordInput.length > 0
    },
  },
  data() {
    return {
      emailInput: '',
      passwordInput: '',
      loading: false,
    }
  },
  methods: {
    async onLoginAttempt() {
      let response
      this.loading = true
      try {
        response = await server.post('/login/password', {
          email: this.emailInput,
          password: this.passwordInput,
        })
        const { message, success, token: apiToken } = response.data
        this.$notify({
          message,
          success,
        })
        if (success && apiToken) {
          token(tokenAuthKey).set(apiToken)
          token(tokenUserKey).set(this.emailInput)
          document.location.href = `${serverUrl}/`
        }
      } catch (error) {
        logger.warn('onLoginAttempt error', error, response)
      }
      logger.info('onLoginAttempt', response)
      this.loading = false
    },
  },
}
</script>
<style>
.container {
  padding-top: 4em;
  font-family: Arial, Helvetica, sans-serif;
  text-align: center;
}
</style>
