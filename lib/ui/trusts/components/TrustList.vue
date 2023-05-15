<template lang="pug">
b-row
  b-col.text-center
    div(v-if='outgoing.length > 0')
      h2 Trusts
      div(v-for='trust of outgoing')
        Button(
          variant='primary'
          @click='onRemoveTrust(trust)'
        ) {{ trust.recipient }}
    small(v-else) No trusts on selected path.
    hr
    b-dropdown(
      text='Add trust'
      variant='primary'
    )
      b-dropdown-form(style='min-width: 300px;')
        b-input-group(size='sm')
          b-input(v-model='newTrustRecipientInput' placeholder='Email of trustee')
          b-input-group-addon
            Button(
              :disabled='!recipientIsValid'
              variant='primary'
              @click='onAddTrust'
              size='sm'
            ) Add trust
    hr
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { Button } from '../../components/Button.vue'
import { emailIsValid } from '../../utilities/emailIsValid'
import { log } from '../../utilities/log'

const logger = log('TrustList')

export default {
  components: {
    Button,
  },
  computed: {
    ...mapState('authentication', ['userEmail']),
    ...mapState('trusts', ['outgoing']),
    recipientIsValid() {
      return (
        emailIsValid(this.newTrustRecipientInput) &&
        this.newTrustRecipientInput !== this.userEmail
      )
    },
  },
  data() {
    return {
      newTrustRecipientInput: '',
    }
  },
  methods: {
    ...mapActions('trusts', ['addTrust', 'removeTrust']),
    async onAddTrust() {
      await this.addTrust({
        recipient: this.newTrustRecipientInput,
        path: this.fragmentPath,
      })
      this.newTrustRecipientInput = ''
    },
    onRemoveTrust(trust) {
      this.removeTrust(trust)
    },
  },
  watch: {
    outgoing(val) {
      if (val.length > 0) {
        logger.info('watch:outgoing', val)
      }
    },
  },
  props: {
    fragmentPath: {
      type: Array,
      required: true,
    },
  },
}
</script>
