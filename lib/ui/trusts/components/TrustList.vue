<template lang="pug">
b-row
  b-col.text-center
    h3 Trusts
    span(v-if='trustsOnPath.length > 0')
      span(v-for='trust of trustsOnPath')
        Button.mr-1(
          :variant=`trust.isConnected ? 'success' : 'secondary'`
          @click='onRemoveTrust(trust)'
        ) {{ trust.recipient }}
    .small(v-else) No trusts on selected path.
    b-dropdown(
      text='Add trust'
      variant='primary'
    )
      b-dropdown-item-button(
        v-for='email of candidates'
        :key='`trustee-candidate-${email}`'
        @click='onAddTrust(email)'
      ) {{ email }}
      b-dropdown-form(
        style='min-width: 300px;'
        @submit.prevent='onAddTrust'
      )
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
import { mapActions, mapGetters, mapState } from 'vuex'
import { Button } from '../../components/Button.vue'
// import { pathsMatching } from '../../fragments/pathsMatching'
import { emailIsValid } from '../../utilities/emailIsValid'
import { log } from '../../utilities/log'
import { uniq } from '../../utilities/uniq'

const logger = log('TrustList')

export default {
  components: {
    Button,
  },
  computed: {
    ...mapState('authentication', ['userEmail']),
    ...mapState('trusts', ['outgoing']),
    ...mapGetters('trusts', ['outgoingOn']),
    candidates() {
      return uniq(this.outgoing.filter(
        (trust, _idx, array) => (
          !this.trustsOnPath.find(t => t.recipient === trust.recipient)
        )
      ).map(t => t.recipient))
    },
    recipientIsValid() {
      return (
        emailIsValid(this.newTrustRecipientInput) &&
        this.newTrustRecipientInput !== this.userEmail
      )
    },
    trustsOnPath() {
      return this.outgoingOn(this.fragmentPath)
    },
  },
  data() {
    return {
      newTrustRecipientInput: '',
    }
  },
  methods: {
    ...mapActions('trusts', ['addTrust', 'removeTrust']),
    async onAddTrust(recipient = this.newTrustRecipientInput) {
      await this.addTrust({
        recipient,
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
